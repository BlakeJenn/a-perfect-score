/*
Add a Score
Authors: Erin McBride and Blake Jennings
Updated on 03/17/2024
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
let addScoreForm = document.getElementById('add-score-form-ajax');

// Modify the objects we need
// Taken from nodejs-start-app provided on git
addScoreForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    // Modified from nodejs-start-app provided on git
    let inputscoreName = document.getElementById("input-score-name-ajax");
    let inputpaperPrice = document.getElementById("input-paperPrice-ajax");
    let inputhardPrice = document.getElementById("input-hardPrice-ajax");
    let inputdigiPrice = document.getElementById("input-digiPrice-ajax");

    // Get the values from the form fields
    // Modified from nodejs-start-app provided on git
    let scoreNameValue = inputscoreName.value;
    let paperPriceValue = inputpaperPrice.value;
    let hardPriceValue = inputhardPrice.value;
    let digiPriceValue = inputdigiPrice.value;

    // Put our data we want to send in a javascript object
    // Modified from nodejs-start-app provided on git
    let data = {
        scoreName: scoreNameValue,
        paperPrice: paperPriceValue,
        hardPrice: hardPriceValue,
        digiPrice: digiPriceValue
    }
    
    // Setup our AJAX request
    // Modified from nodejs-start-app provided on git
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-score-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    // Taken from nodejs-start-app provided on git
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            let response = JSON.parse(xhttp.responseText);
            // // Add the new data to the table
            addRowToTable(response);


            // Clear the input fields for another transaction
            // Modified from nodejs-start-app provided on git
            inputscoreName.value = '';
            inputpaperPrice.value = '';
            inputhardPrice.value = '';
            inputdigiPrice.value = '';
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
    let currentTable = document.getElementById("Scores");

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
    let scoreIDCell = document.createElement("TD");
    let scoreNameCell = document.createElement("TD");
    let paperPriceCell = document.createElement("TD");
    let hardPriceCell = document.createElement("TD");
    let digiPriceCell = document.createElement("TD");
    let deleteButton = document.createElement("button");
    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    // Modified from nodejs-start-app provided on git
    scoreIDCell.innerText = newRow.scoreID;
    scoreNameCell.innerText = newRow.scoreName;
    paperPriceCell.innerText = newRow.paperPrice;
    hardPriceCell.innerText = newRow.hardPrice;
    digiPriceCell.innerText = newRow.digiPrice;

    deleteButton.innerHTML = "Delete";
    deleteButton.onclick = function() { deleteScore(newRow.scoreID); };
    deleteCell.appendChild(deleteButton);

    // Add the cells to the row 
    // Modified from nodejs-start-app provided on git
    row.appendChild(scoreIDCell);
    row.appendChild(scoreNameCell);
    row.appendChild(paperPriceCell);
    row.appendChild(hardPriceCell);
    row.appendChild(digiPriceCell);
    row.appendChild(deleteCell);

    row.setAttribute('data-value', newRow.scoreID);
    
    // Add the row to the table
    // Taken from nodejs-start-app provided on git
    currentTable.appendChild(row);

};
