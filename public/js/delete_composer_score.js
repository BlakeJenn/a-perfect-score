/*
Delete a Composer Score
Authors: Erin McBride and Blake Jennings
Updated on 03/17/2024
CS_340 Group 170
Citation for the following file:
    Date: 3/17/2024
    Adapted from nodejs-start-app provided on git
    Baseline js code was copied over, then expanded upon to fit our page.
    Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
*/

// Modified from nodejs-start-app provided on git
function deleteComposerScore(composerScoreID) {
    let link = '/delete-composer-score-ajax/';
    let data = {
      composerScoreID: composerScoreID
    };
  
    // Modified from nodejs-start-app provided on git
    $.ajax({
      url: link,
      type: 'DELETE',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      success: function(result) {
        deleteRow(composerScoreID);

        // Refresh page to reflect Delete
        location.reload();
      }
    });
  }
  
  // Modified from nodejs-start-app provided on git
  function deleteRow(composerScoreID){
      let table = document.getElementById("ComposerScores");
      for (let i = 0, row; row = table.rows[i]; i++) {
         if (table.rows[i].getAttribute("data-value") == composerScoreID) {
              table.deleteRow(i);
              break;
         }
      }
  }