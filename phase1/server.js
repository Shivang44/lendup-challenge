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

// Add the route
server.route({
    method: 'GET',
    path:'/gatherDigit',
    handler: function (request, h) {
        let response = new VoiceResponse();
        const gather = response.gather({
          input: 'dtmf',
          action: '/sayFizzBuzz',
          method: 'GET',
          timeout: 5
        });
        gather.say('Please enter a number: ');
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
        let digit = request.query.Digits;
        let fizzBuzzString = generateFizzBuzzString(digit);
        response.say(fizzBuzzString);
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
