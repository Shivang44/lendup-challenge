const Hapi = require('hapi');
const Inert = require('inert');
const Phase1 = require('./phase1/app.js');
const Phase2 = require('./phase2/app.js');
const Phase3 = require('./phase3/app.js');

// Create a server with a host and port
const server = Hapi.server({
    host: '0.0.0.0',
    port: process.env.PORT || 8080
});

// Start the server
async function start() {

    try {
        await server.register(Inert);   // Inert is used to serve static files in nodejs

        /* The endpoints for each phase are defined in their own directory (phase1, phase2, etc)
        *  We register them in one nodejs app so one app can run all phases. This also allows us
        *  to reuse code between the different phases, since they build on top of each other.
        */
        let phases = Phase1.concat(Phase2).concat(Phase3);
        server.route(phases);
        await server.start();
    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }

    console.log('Server running at:', server.info.uri);
};

start();
