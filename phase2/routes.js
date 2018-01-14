const Twilio = require('twilio');
const VoiceResponse = Twilio.twiml.VoiceResponse;
const Boom = require('boom');   /* Used to create standardized HTTP error responses. */
const Joi = require('joi');     /* Used for input validation */
const accountSid = 'AC52b0186c5cc86941663afe7256a6d9d6'; /* TODO: Remove these infavour of environment variables */
const authToken = '61cfc3afa581d6ddc94b6af988fa9c20';

const routes = [
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
                url: 'http://' + request.info.host + '/phase1/phoneBuzz',   /* No need to rewrite code, just call phase1 endpoint! */
                to: phone,
                from: '+15103451850',
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
