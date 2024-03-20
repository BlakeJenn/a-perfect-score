/*
Add an Order Score
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
let addOSForm = document.getElementById('add-order-score-form-ajax');

// Modify the objects we need
// Taken from nodejs-start-app provided on git
addOSForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    // Modified from nodejs-start-app provided on git
    let inputorderID = document.getElementById("input-order-id-ajax");
    let inputscoreID = document.getElementById("input-score-id-ajax");
    let inputquantity = document.getElementById("input-quantity-ajax");
    let inputscoreType = document.getElementById("input-score-type-ajax");

    // Get the values from the form fields
    // Modified from nodejs-start-app provided on git
    let orderIDValue = inputorderID.value;
    let scoreIDValue = inputscoreID.value;
    let quantityValue = inputquantity.value;
    let scoreTypeValue = inputscoreType.value;

    // Put our data we want to send in a javascript object
    // Modified from nodejs-start-app provided on git
    let data = {
        orderID: orderIDValue,
        scoreID: scoreIDValue,
        quantity: quantityValue,
        scoreType: scoreTypeValue
    }
    
    // Setup our AJAX request
    // Modified from nodejs-start-app provided on git
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-order-score-ajax", true);
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
            inputorderID.value = '';
            inputscoreID.value = '';
            inputquantity.value = '';
            inputscoreType.value = '';
        }
        // Taken from nodejs-start-app provided on git
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log(xhttp.status);
            console.log("There was an error with the input.");
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})

// Modified from nodejs-start-app provided on git
addRowToTable = (data) => {

    let newRow = data
    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("order-scores");

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
    let orderScoreIDCell = document.createElement("TD");
    let orderIDCell = document.createElement("TD");
    let scoreIDCell = document.createElement("TD");
    let quantityCell = document.createElement("TD");
    let scoreTypeCell = document.createElement("TD");
    let deleteButton = document.createElement("button");
    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    // Modified from nodejs-start-app provided on git
    orderScoreIDCell.innerText = newRow.orderScoreID;
    orderIDCell.innerText = newRow.orderID;
    scoreIDCell.innerText = newRow.scoreID;
    quantityCell.innerText = newRow.quantity;
    scoreTypeCell.innerText = newRow.scoreType;

    deleteButton.innerHTML = "Delete";
    deleteButton.onclick = function() { deleteOrderScore(newRow.orderScoreID); };
    deleteCell.appendChild(deleteButton);

    // Add the cells to the row 
    // Modified from nodejs-start-app provided on git
    row.appendChild(orderScoreIDCell);
    row.appendChild(orderIDCell);
    row.appendChild(scoreIDCell);
    row.appendChild(quantityCell);
    row.appendChild(scoreTypeCell);
    row.appendChild(deleteCell);

    row.setAttribute('data-value', newRow.orderScoreID);
    
    // Add the row to the table
    // Taken from nodejs-start-app provided on git
    currentTable.appendChild(row);
    
    // Modified from nodejs-start-app provided on git   
    let selectMenu = document.getElementById("mySelect");
    let option = document.createElement("option");
    option.text = newRow.orderScoreID;
    option.value = newRow.orderScoreID;
    selectMenu.add(option);

};
