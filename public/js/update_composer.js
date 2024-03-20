/*
Update a Composer
Authors: Erin McBride and Blake Jennings
Updated on 03/18/2024
CS_340 Group 170
Citation for the following file:
    Date: 3/17/2024
    Adapted from nodejs-start-app provided on git
    Baseline js code was copied over, then expanded upon to fit our page.
    Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
    Source Authors: George Kochera, Michael Curry, Cortona1, dmgs11
*/

// Get the objects we need to modify
// Modified from nodejs-start-app provided on git
let updateComposerForm = document.getElementById('update-composer-form-ajax');

// Modify the objects we need
// Modified from nodejs-start-app provided on git
updateComposerForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    // Taken from nodejs-start-app provided on git
    e.preventDefault();

    // Get form fields we need to get data from
    // Modified from nodejs-start-app provided on git
    let composerID = document.getElementById("mySelect-composer-id").value;
    let inputComposerFirst = document.getElementById("input-composer-fname-update").value;
    let inputComposerLast = document.getElementById("input-composer-lname-update").value;

    // Modified from nodejs-start-app provided on git
    if (isNaN(composerID)) 
    {
        console.log("composerID is NaN");
        return;
    }


    // Put our data we want to send in a javascript object
    // Modified from nodejs-start-app provided on git
    let data = {
        composerID: composerID,
        composerFirst: inputComposerFirst,
        composerLast: inputComposerLast,
    };
    
    // Setup our AJAX request
    // Modified from nodejs-start-app provided on git
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-composer-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    // Modified from nodejs-start-app provided on git
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, composerID);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    // Taken from nodejs-start-app provided on git
    xhttp.send(JSON.stringify(data));
        // Refresh page
        location.reload();

})

// Modified from nodejs-start-app provided on git
function updateRow(data, composerID){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("Composers");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == composerID) {

            // Get the location of the row where we found the matching Composer ID
            // Taken from nodejs-start-app provided on git
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of Composer value
            let td = updateRowIndex.getElementsByTagName("td")[3];

            // Reassign Composer to our value we updated to
            td.innerHTML = parsedData[0].name;


       }
    }
}
