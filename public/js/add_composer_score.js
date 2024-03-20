/*
Add a Composer Score
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
let addOSForm = document.getElementById('add-composer-score-form-ajax');

// Modify the objects we need
// Taken from nodejs-start-app provided on git
addOSForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    // Modified from nodejs-start-app provided on git
    let inputcomposerID = document.getElementById("input-composer-id-ajax");
    let inputscoreID = document.getElementById("input-score-id-ajax");

    // Get the values from the form fields
    // Modified from nodejs-start-app provided on git
    let composerIDValue = inputcomposerID.value;
    let scoreIDValue = inputscoreID.value;

    // Put our data we want to send in a javascript object
    // Modified from nodejs-start-app provided on git
    let data = {
        composerID: composerIDValue,
        scoreID: scoreIDValue
    }
    
    // Setup our AJAX request
    // Modified from nodejs-start-app provided on git
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-composer-score-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    // Taken from nodejs-start-app provided on git
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            let response = JSON.parse(xhttp.responseText);
            console.log(response);
            // // Add the new data to the table
            addRowToTable(response);


            // Clear the input fields for another transaction
            // Modified from nodejs-start-app provided on git
            inputcomposerID.value = '';
            inputscoreID.value = '';
        }
        // Taken from nodejs-start-app provided on git
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log(xhttp.status)
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})

// Modified from nodejs-start-app provided on git
addRowToTable = (data) => {

    let newRow = data
    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("ComposerScores");

    // Get the location where we should insert the new row (end of table)
    // Taken from nodejs-start-app provided on git
    let newRowIndex = currentTable.rows.length;

    if (!newRow || typeof newRow !== 'object') {
        console.error('Received data is not in the expected format:', data);
        return; // Stop the function if data is not correct
    }

    // Create a row and cells
    // Modified from nodejs-start-app provided on git
    let row = document.createElement("TR");
    let composerScoreIDCell = document.createElement("TD");
    let composerIDCell = document.createElement("TD");
    let scoreIDCell = document.createElement("TD");
    let deleteButton = document.createElement("button");
    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    // Modified from nodejs-start-app provided on git
    composerScoreIDCell.innerText = newRow.composerScoreID;
    composerIDCell.innerText = newRow.composerID;
    scoreIDCell.innerText = newRow.scoreID;

    deleteButton.innerHTML = "Delete";
    deleteButton.onclick = function() { deleteComposerScore(newRow.composerScoreID); };
    deleteCell.appendChild(deleteButton);

    // Add the cells to the row 
    // Modified from nodejs-start-app provided on git
    row.appendChild(composerScoreIDCell);
    row.appendChild(composerIDCell);
    row.appendChild(scoreIDCell);
    row.appendChild(deleteCell);

    row.setAttribute('data-value', newRow.composerScoreID);
    
    // Add the row to the table
    // Taken from nodejs-start-app provided on git
    currentTable.appendChild(row);
    
    // Modified from nodejs-start-app provided on git   
    let selectMenu = document.getElementById("mySelect-composer-score-id");
    let option = document.createElement("option");
    option.text = newRow.composerScoreID;
    option.value = newRow.composerScoreID;
    selectMenu.add(option);

};
