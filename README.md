# lendup-challenge
PhoneBuzz - a set of coding challenges by Lendup. Built with Nodejs, Hapijs, and the Twilio API.

# Configuring

The environment variables "accountSid" and "authToken" need to be set to your Twilio credentials in your shell environment, so nodejs can read them with process.env.accountSid, etc. You will also need to change the "from" number in phase2's app.js on line 43. You can also change from the default port by setting the "PORT" environment variable. (On my Ubuntu machine I do this with "export var=value").

Also, if your machine is like mine, Twilio can't reach it over the network. Using ngrok to create a tunnel to localhost solved that issue for me.

# Build instructions
After cloning the repo, building this app should be as simple as running:

- npm install
- npm start

This project was developed with node version 8.9.4, although any recent version should work.

# Project details

This challenge is split into 3 phases. This nodejs application contains all 3 phases. This means when you run npm start, all 3 phases are running, and in fact, later phases depend on code from previous phases, so there is code reuse. To run phases 2 and 3, you can visit the urls:

- http://45.77.189.171/phase2
- http://45.77.189.171/phase3
