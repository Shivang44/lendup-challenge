const Twilio = require('twilio');
const VoiceResponse = Twilio.twiml.VoiceResponse;
const Boom = require('boom');   /* Used to create standardized HTTP error responses. */
const Joi = require('joi');     /* Used for input validation */
const accountSid = 'AC7c890db3d49a3f988f2ea19d9cf80369'; /* TODO: Remove these infavour of environment variables */
const authToken = '416ca672786a7e75b34b59ee4b72b9ed';

const routes = [
    /*
    * This route will be invoked after the user enters his phone number and presses "Call Me."
    *
    * This route will validate the phone number as a 10-digit number, and then use the Twilio api
    * to call the user. Since phone buzz was fully implemented in phase1, this route will just invoke
    * the route from phase1 rather than rewriting the phone buzz logic.
    *
    * If the call was successful, a success message will be returned to the user. Otherwise, a 503
    * service unavailable will be returned. The client to this method will handle these cases appropriately.
    */
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
    },

    // Home page for phase 2
    {
        method: 'GET',
        path: '/phase2/',
        handler: {
            file: './phase2/static/index.html'
        }
    },

    // This route will serve all our static files (html, js, css)
    {
        method: 'GET',
        path:'/phase2/static/{param*}',
        handler: {
            directory: {
                path: './phase2/static/'
            }
        }
    }
];

module.exports = routes;
