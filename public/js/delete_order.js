/*
Delete an Order
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

// Modified from nodejs-start-app provided on git
function deleteOrder(orderID) {
    let link = '/delete-order-ajax/';
    let data = {
      orderID: orderID
    };
  
    // Modified from nodejs-start-app provided on git
    $.ajax({
      url: link,
      type: 'DELETE',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      success: function(result) {
        deleteRow(orderID);

        // Refresh page to reflect Delete
        location.reload();
      }
    });
  }
  
  // Modified from nodejs-start-app provided on git
  function deleteRow(orderID){
      let table = document.getElementById("orders");
      console.log("Attempting to delete order with ID:", orderID);
      for (let i = 0, row; row = table.rows[i]; i++) {
         if (table.rows[i].getAttribute("data-value") == orderID) {
              table.deleteRow(i);
              break;
         }
      }
  }