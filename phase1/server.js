const VoiceResponse = require('twilio').twiml.VoiceResponse;
const Hapi = require('hapi');
const TWILIO_SPEECH_LIMIT = 4096;

// Create a server with a host and port
const server = Hapi.server({
    host: '0.0.0.0',
    port: 8080
});

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
        console.log('Ran gatherDigit');
        let response = new VoiceResponse();
        const gather = response.gather({
          input: 'dtmf',
          action: '/sayFizzBuzz',
          method: 'GET',
          timeout: 5,
          numDigits: 3
        });
        gather.say('Welcome to Phonebuzz. Please enter a number from 1 to 800: ');
        response.say('You did not enter a number. Please try again by recalling this number.');
        return response.toString();
    }
});

// Add the route
server.route({
    method: 'GET',
    path:'/sayFizzBuzz',
    handler: function (request, h) {
        let response = new VoiceResponse();
        let digit = parseInt(request.query.Digits);
        if (!parseInt(digit) || parseInt(digit) )

        let fizzBuzzString = generateFizzBuzzString(digit);
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
