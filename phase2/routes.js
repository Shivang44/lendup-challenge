const Twilio = require('twilio');
const VoiceResponse = Twilio.twiml.VoiceResponse;
const Boom = require('boom');   /* Used to create standardized HTTP error responses. */
const Joi = require('joi');     /* Used for input validation */
const accountSid = 'AC7c890db3d49a3f988f2ea19d9cf80369'; /* TODO: Remove these infavour of environment variables */
const authToken = '416ca672786a7e75b34b59ee4b72b9ed';

const routes = [
    {
        method: 'GET',
        path: '/',
        handler: function(req, reply) {
            return "hi";
        }
    },
    {
        method: 'GET',
        path:'/phase2/',
        handler: {
            file: './phase2/index.html'
        }
    },
    {
        method: 'POST',
        path: '/phase2/callUser',
        handler: function (request, response) {
            let phone = request.payload.phone; /* Validated with Joi in config section below */

            const client = new Twilio(accountSid, authToken);

            return client.api.calls
              .create({
                url: 'http://' + request.info.host + '/phase1/phoneBuzz',   /* No need to rewrite code, just call phase1's endpoint! */
                to: phone,
                from: '+16194040514',
              })
              .then((call) => {
                  console.log("Calling user's number: " + phone);
                  return {
                      msg: "Calling provided number!"
                  };
              })
              .catch((error) => {
                  console.log(error);
                  return Boom.serverUnavailable("Unable to make call. Please try again.");
              });
        },
        config: {
            validate: {
                payload: {
                    /* Ensure sure phone number is 10 digits long. Better phone number validation could be done here. */
                    phone: Joi.string().regex(/^\d{10}$/)
                }
            }
        }
    }
];

module.exports = routes;
