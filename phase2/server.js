const VoiceResponse = require('twilio').twiml.VoiceResponse;
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
            return "yay";
        },
        config: {
            validate: {
                payload: {
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
