// ./database/db-connector.js

/*
Authors: Erin McBride and Blake Jennings
Updated on 03/1/2024
CS_340
Group 170
*/

// Source:
    // Date: Various throughout 2/2024 and 3/2024
    // Adapted from nodejs-starter-app provided on git
    // Baseline js code was copied over, changed username, password, and database to reflect our credentials
    // Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
    // Source Authors: George Kochera, Michael Curry, Cortona1, dmgs11


// Get an instance of mysql we can use in the app
// Taken from nodejs-start-app provided on git
var mysql = require('mysql')

// Create a 'connection pool' using the provided credentials
// Modified from nodejs-start-app provided on git
var pool = mysql.createPool({
    connectionLimit : 10,
    host            : 'classmysql.engr.oregonstate.edu',
    user            : '',
    password        : '',
    database        : ''
})

// Export it for use in our applicaiton
// Taken from nodejs-start-app provided on git
module.exports.pool = pool;