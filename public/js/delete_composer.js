/*
Delete a Composer
Authors: Erin McBride and Blake Jennings
Updated on 03/1782024
CS_340 Group 170
Citation for the following file:
    Date: 3/17/2024
    Adapted from nodejs-start-app provided on git
    Baseline js code was copied over, then expanded upon to fit our page.
    Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
    Source Authors: George Kochera, Michael Curry, Cortona1, dmgs11
*/

// Modified from nodejs-start-app provided on git
function deleteComposer(composerID) {
    let link = '/delete-composer-ajax/';
    let data = {
      composerID: composerID
    };
  
    // Modified from nodejs-start-app provided on git
    $.ajax({
      url: link,
      type: 'DELETE',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      success: function(result) {
        deleteRow(composerID);

        // Refresh page to reflect Delete
        location.reload();
      }
    });
  }
  
  // Modified from nodejs-start-app provided on git
  function deleteRow(composerID){
      let table = document.getElementById("Composers");
      for (let i = 0, row; row = table.rows[i]; i++) {
         if (table.rows[i].getAttribute("data-value") == composerID) {
              table.deleteRow(i);
              break;
         }
      }
  }