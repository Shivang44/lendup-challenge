const Twilio = require('twilio');
const VoiceResponse = Twilio.twiml.VoiceResponse;
const Boom = require('boom');   /* Used to create standardized HTTP error responses. */
const Joi = require('joi');     /* Used for input validation */
const request = require('request');
const accountSid = 'AC7c890db3d49a3f988f2ea19d9cf80369'; /* TODO: Remove these infavour of environment variables */
const authToken = '416ca672786a7e75b34b59ee4b72b9ed';


const routes = [
    {
        method: 'POST',
        path: '/phase3/callUser',
        handler: function (req, response) {
            let delay = parseInt(req.payload.delay, 10);    // Validated with Joi below
            let phone = req.payload.phone;

            /* Delayed calling is easy with Nodejs's event loop!
            * Note: The user will be called at a *minimum* of [delay] minutes. In reality
            * the call may be a few milliseconds late. This is okay since we are using minutes
            * as the time denomination.
            */
            setTimeout(function() {
                // We can reuse phase2's call route!
                request.post('http://' + req.info.host + '/phase2/callUser').form({ phone: phone });
            }, 1000 * 60 * delay);

            return {msg: "Scheduled call!"};;
        },
        config: {
            validate: {
                payload: {
                    // Ensure sure phone number is 10 digits long. Better phone number validation could be done here.
                    // Also ensure delay is an integer in the range of [0, 1000]
                    phone: Joi.string().regex(/^\d{10}$/).required(),
                    delay: Joi.number().integer().min(0).max(1000).required()
                }
            }
        }
    },
    // Home page for phase 2
    {
        method: 'GET',
        path: '/phase3',
        handler: {
            file: './phase3/static/index.html'
        }
    },

    // This route will serve all our static files (html, js, css)
    {
        method: 'GET',
        path:'/phase3/static/{param*}',
        handler: {
            directory: {
                path: './phase3/static/'
            }
        }
    }
];

module.exports = routes;
