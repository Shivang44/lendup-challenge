const VoiceResponse = require('twilio').twiml.VoiceResponse;
const Hapi = require('hapi');
const Boom = require('boom');

// Create a server with a host and port
const server = Hapi.server({
    host: '0.0.0.0',
    port: 8080
});

/*
* A very simple Fizz Buzz String generator.
*
* Given a valid valid number n, this will generate from 1 up to n, with spaces
* between each digit. If the digit is divisble by 3, "Fizz" is shown instead of
* n. If the number is divisble by 5, "Buzz" is shown instead of n. If n is divisble
* by both 3 and 5, "FizzBuzz" is shown instead of n.
*/
function generateFizzBuzzString(digit) {
    let response = "";
    for (var i = 1; i <= digit; i++) {
        let currentResp = "";
        if (i % 3 == 0) {
            currentResp += "Fizz";
        }

        if (i % 5 == 0) {
            currentResp += "Buzz";
        }

        response += currentResp || i;
        response += " ";
    }
    return response;
}

/*
* Main route that twilio will call once a user calls our number. This route will
* ask the user to enter a number between 1 and 800 (see note below for why)
* and then call the appropriate route to say the fizzbuzz up to that number.
*
* If the user does not enter a number, an error message is spoken and the call
* is hung up. The number range validation check is done in the /sayFizzBuzz route.
*
* Note: Twilio can say a maximum of 4096 unicode characters. Because of this,
* the fizzbuzz string must be limited, and a sensible limit is the number 800.
*/
server.route({
    method: 'GET',
    path:'/gatherDigit',
    handler: function (request, h) {
        let response = new VoiceResponse();

        const gather = response.gather({
          input: 'dtmf',
          action: '/sayFizzBuzz',
          method: 'GET',
          timeout: 8,
          numDigits: 3
        });
        gather.say('Welcome to Phonebuzz. Please enter a number from 1 to 800: ');

        // If the user enters a number, this code will never be reached.
        // If the user does not enter a number, we will speak an error message.
        response.say('You did not enter a number. Please call and try again.');
        return response.toString();
    }
});

/*
*
* This endpoint will be called by Twilio after the user enters a digit.

* This endpoint will do error checking to make sure the digit is valid and within
* the allowed range of [1, 800]. If it is a valid digit, a Fizz Buzz string
* will be generated and spoken to the user.
*
*/
server.route({
    method: 'GET',
    path:'/sayFizzBuzz',
    handler: function (request, h) {
        // Make sure the user's number was passed in the request.
        if (typeof(request.query.Digits) === "undefined") {
            // Return a 400 Bad Request error (client error)
            return Boom.badRequest('Bad query. Digits must be defined.');
        }

        let response = new VoiceResponse();

        // Check whether the number is valid and within the allowed range of [1, 800]
        let digit = parseInt(request.query.Digits);
        if (isNaN(digit) || digit < 1 || digit > 800) {
            response.say("The number must be in the range of 1 to 800. Please call and try again.");
        } else {
            // Valid number! Generate fizzbuzz string and say the string.
            let fizzBuzzString = generateFizzBuzzString(digit);
            response.say(fizzBuzzString);
        }

        return response.toString();
    }
});

// Start the server
async function start() {

    try {
        await server.start();
    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }

    console.log('Server running at:', server.info.uri);
};

start();
