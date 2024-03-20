/*
Add a Customer
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
let addCustomerForm = document.getElementById('add-customer-form-ajax');

// Modify the objects we need
// Taken from nodejs-start-app provided on git
addCustomerForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    // Modified from nodejs-start-app provided on git
    let inputFirstName = document.getElementById("input-first-name-ajax");
    let inputLastName = document.getElementById("input-last-name-ajax");
    let inputOrg = document.getElementById("input-org-ajax");
    let inputEmail = document.getElementById("input-email-ajax");
    let inputAddress = document.getElementById("input-address-ajax");

    // Get the values from the form fields
    // Modified from nodejs-start-app provided on git
    let firstNameValue = inputFirstName.value;
    let lastNameValue = inputLastName.value;
    let orgValue = inputOrg.value;
    let emailValue = inputEmail.value;
    let addressValue = inputAddress.value;

    // Put our data we want to send in a javascript object
    // Modified from nodejs-start-app provided on git
    let data = {
        firstName: firstNameValue,
        lastName: lastNameValue,
        organization: orgValue,
        email: emailValue,
        address: addressValue
    }
    
    // Setup our AJAX request
    // Modified from nodejs-start-app provided on git
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-customer-ajax", true);
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
            inputFirstName.value = '';
            inputLastName.value = '';
            inputOrg.value = '';
            inputEmail.value = '';
            inputAddress.value = '';
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
    let currentTable = document.getElementById("customers");

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
    let customerIDCell = document.createElement("TD");
    let firstNameCell = document.createElement("TD");
    let lastNameCell = document.createElement("TD");
    let organizationCell = document.createElement("TD");
    let emailCell = document.createElement("TD");
    let addressCell = document.createElement("TD");
    let deleteButton = document.createElement("button");
    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    // Modified from nodejs-start-app provided on git
    customerIDCell.innerText = newRow.CustomerID;
    firstNameCell.innerText = newRow.firstName;
    lastNameCell.innerText = newRow.lastName;
    organizationCell.innerText = newRow.organization;
    emailCell.innerText = newRow.email;
    addressCell.innerText = newRow.address

    deleteButton.innerHTML = "Delete";
    deleteButton.onclick = function() { deleteCustomer(newRow.customerID); };
    deleteCell.appendChild(deleteButton);

    // Add the cells to the row 
    // Modified from nodejs-start-app provided on git
    row.appendChild(customerIDCell);
    row.appendChild(firstNameCell);
    row.appendChild(lastNameCell);
    row.appendChild(organizationCell);
    row.appendChild(emailCell);
    row.appendChild(addressCell);
    row.appendChild(deleteCell);

    row.setAttribute('data-value', newRow.customerID);
    
    // Add the row to the table
    // Taken from nodejs-start-app provided on git
    currentTable.appendChild(row);
    
    // Modified from nodejs-start-app provided on git   
    let selectMenu = document.getElementById("mySelect-customer-id");
    let option = document.createElement("option");
    option.text = newRow.customerID;
    option.value = newRow.customerID;

};
