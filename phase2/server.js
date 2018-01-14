const Twilio = require('twilio');
const Hapi = require('hapi');
const Boom = require('boom');   /* Used to create standardized HTTP error responses. */
const Joi = require('joi');     /* Used for input validation */

// Create a server with a host and port
const server = Hapi.server({
    host: '0.0.0.0',
    port: 8080
});

const routes = [
    {
        method: 'GET',
        path:'/',
        handler: {
            file: 'index.html'
        }
    },
    {
        method: 'POST',
        path: '/callUser',
        handler: function (request, response) {
            let phone = request.payload.phone; /* Validated with Joi in config section below */

            const accountSid = 'AC52b0186c5cc86941663afe7256a6d9d6';
            const authToken = '61cfc3afa581d6ddc94b6af988fa9c20';
            const client = new Twilio(accountSid, authToken);

            return client.api.calls
              .create({
                url: 'http://demo.twilio.com/docs/voice.xml',
                to: phone,
                from: '+15103451850',
              })
              .then((call) => {
                  return {
                      msg: "Calling provided number!"
                  };
              })
              .catch((error) => {
                  return Boom.serverUnavailable("Unable to make call. Please try again.");
              });
        },
        config: {
            validate: {
                payload: {
                    /* Ensure sure phone number is 10 digits long. */
                    phone: Joi.string().regex(/^\d{10}$/)
                }
            }
        }
    }
];


// Start the server
async function start() {

    try {
        await server.register(require('inert'));
        server.route(routes);
        await server.start();
    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }

    console.log('Server running at:', server.info.uri);
};

start();
