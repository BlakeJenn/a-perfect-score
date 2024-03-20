/*
Update an Order Score
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
let updateOrderScoreForm = document.getElementById('update-order-score-form-ajax');

// Modify the objects we need
// Modified from nodejs-start-app provided on git
updateOrderScoreForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    // Taken from nodejs-start-app provided on git
    e.preventDefault();

    // Get form fields we need to get data from
    // Modified from nodejs-start-app provided on git
    let orderScoreID = document.getElementById("mySelect").value;
    let inputScoreID = document.getElementById("input-score-id-update").value;
    let inputQuantity = document.getElementById("input-score-quantity-update").value;
    let scoreType = document.getElementById("input-score-type-update").value;

    // Modified from nodejs-start-app provided on git
    if (isNaN(orderScoreID)) 
    {
        console.log("orderScoreID is NaN");
        return;
    }


    // Put our data we want to send in a javascript object
    // Modified from nodejs-start-app provided on git
    let data = {
        orderScoreID: orderScoreID,
        scoreID: inputScoreID,
        quantity: inputQuantity,
        scoreType: scoreType
    };
    
    // Setup our AJAX request
    // Modified from nodejs-start-app provided on git
    var xhttp = new XMLHttpRequest();
    xhttp.responseType = 'json';
    xhttp.open("PUT", "/put-order-score-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    // Modified from nodejs-start-app provided on git
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, orderScoreID);
            location.reload();

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    // Taken from nodejs-start-app provided on git
    xhttp.send(JSON.stringify(data));
        // Refresh page

})

// Modified from nodejs-start-app provided on git
function updateRow(response, orderScoreID){
    let newRow = response;
    let table = document.getElementById("order-scores");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == orderScoreID) {

            let cells = table.rows[i].cells;
            cells[1].innerText = newRow.orderID; 
            cells[2].innerText = newRow.scoreID;
            cells[3].innerText = newRow.quantity;
            cells[4].innerText = newRow.scoreType;

            console.log(newRow); // See what data you have
            break;


       }
    }
}
