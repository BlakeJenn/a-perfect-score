// App.js
/*
Authors: Erin McBride and Blake Jennings
Updated on 03/18/2024
CS_340 Group 170
Citation for the following file:
    Date: 3/17/2024
    Adapted from nodejs-starter-app provided on git
    Baseline js code was copied over, then expanded upon to fit our page.
    Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
    Source Authors: George Kochera, Michael Curry, Cortona1, dmgs11
Additional Citations:
    Date: 3/12/2024
    Adapted from w3schools for determing if scoreType is in array
    URL: https://www.w3schools.com/jsref/jsref_includes_array.asp
*/



// SETUP //



// Taken from nodejs-starter-app provided on git
var express = require('express');   
var app     = express();            
var path = require('path'); 
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Below line changed from starter-app to support our pathing
app.use(express.static(path.join(__dirname, 'public')));

PORT = 15939; 

// Database
// Taken from nodejs-starter-app provided on git
var db = require('./database/db-connector');

// Taken from nodejs-starter-app provided on git
const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars

// Below modified from node-js-starter-app setting default layout to main.hbs
app.engine('.hbs', engine({
    extname: ".hbs",
    defaultLayout: 'main'
}));  
app.set('view engine', '.hbs');                 
app.set('views', './views');


// ROUTES //


// Modified from nodejs-starter-app provided on git to render index.hbs as homepage
app.get('/', function(req, res) {
    res.render('index');
});


// CUSTOMERS //

// Read Customers // Modified from nodejs-starter-app
app.get('/Customers', function(req, res) {  
    let query1;
    // Modified from nodejs-starter-app to check for filtering input
    if (!req.query['input-customer-id'] || req.query['input-customer-id'] === '') 
    {
        query1 = "SELECT * FROM Customers;";      // Return all from Customers, no ID selected         
    }
    else
    {
        query1 = `SELECT * FROM Customers WHERE customerID = ?`;    // Return only Customer with matching customerID
    }


    // Modified from nodejs-starter-app, checks for input to pass to query or returns empty array 
    db.pool.query(query1, req.query['input-customer-id'] ? [req.query['input-customer-id']] : [], function(error, rows) {
        let customers = rows;
        return res.render('Customers', {data: customers});  
            })                
        })                                                      
;                                                         

// Create Customer // modified from nodejs-starter-app
app.post('/add-customer-ajax', function(req, res) 
{
    // Taken from nodejs-starter-app
    let data = req.body;

    // Updated from nodejs-starter-app to reflect attribute names
    let firstName = data.firstName;

    let lastName = data.lastName;

    let organization = data.organization;

    let email = data.email;

    let address = data.address;


    //Modified from nodejs-starter-app - how values are handled was changed
    let query1 = `INSERT INTO Customers (firstName, lastName, organization, email, address) VALUES (?, ?, ?, ?, ?)`;    

    // Modified from nodejs-start-app provided - values passed to query, function now returns result
    db.pool.query(query1, [firstName, lastName, organization, email, address], function(error, result) {

        // Taken from nodejs-starter-app
        if (error) 
        {
            console.log(error)
            res.sendStatus(400);
        }
        else
        {   
            // Modified from nodejs-starter-app 
            let insertId = result.insertId;
            // Modified from nodejs-starter-app - select by customerID
            let query2 = `SELECT * FROM Customers WHERE customerID = ?;`;
            db.pool.query(query2, [insertId], function(error, rows){

                // Taken from nodejs-starter-app
                if (error) 
                {
                    console.log(error);
                    res.sendStatus(400);
                }
                else
                {
                    // Modified from nodejs-starter-app, sends new row
                    res.send(rows[0]);
                }
            })
        }
    })
});


// Delete Customer // Modified from nodejs-starter-app
app.delete('/delete-customer-ajax/', function(req,res){
    let data = req.body;
    let customerID = parseInt(data.customerID);
    // Added to check for valid customerID
    if (!isNaN(customerID))
    {
        // Modified from nodejs-starter-app provided on git        
        let deletecustomerquery = `DELETE FROM Customers WHERE customerID = ?`;

        // Modified from nodejs-starter-app provided on git
        db.pool.query(deletecustomerquery, [customerID], function(error, rows, fields){
            // Taken from nodejs-starter-app
            if (error) 
            {
            console.log(error);
            res.sendStatus(400);
            } else 
            { 
                // Added to reflect successful deletion
                res.sendStatus(200);
            }
        });
    }
    else
    {
        res.sendStatus(204);
    }
});


// Update Customer // Modified from nodejs-starter-app
app.put('/put-customer-ajax', function(req,res,next){
    // Taken from nodejs-starter-app
    let data = req.body;
    // Modified variable names
    let customerID = parseInt(data.customerID);
    // Added to check for valid customerID
    if (isNaN(customerID))
    {
        console.log('customerID is not a valid number');
        res.sendStatus(400);
        return
    }
    // Modified variable names
    let firstName = data.firstName;
    let lastName = data.lastName;
    let organization = data.organization;
    let email = data.email;
    let address = data.address
  
    // Modified from nodejs-starter-app to reflect table attributes
    let queryUpdateCustomer = `UPDATE Customers SET firstName = ?, lastName = ?, organization = ?, email = ?, address = ? WHERE customerID = ?`;

          // Modified from nodejs-starter-app to reflect table attributes
          db.pool.query(queryUpdateCustomer, [firstName, lastName, organization, email, address, customerID], function(error, rows, fields){
              // Taken from nodejs-starter-app            
              if (error) 
              {
              console.log(error);
              res.sendStatus(400);
              }
              else
              {
                  // Modified from nodejs-start-app provided on git
                  let selectUpdatedRow = `SELECT * FROM Customers WHERE customerID = ?`;
                  // Modified from nodejs-start-app provided -  function now returns selectResults
                  db.pool.query(selectUpdatedRow, [customerID], function(selectError, selectResults) {
                      // Modified from nodejs-starter-app  changed error to selectError
                      if (selectError) 
                      {
                          console.log(selectError);
                          res.sendStatus(400);
                      } else 
                      {
                            res.json(selectResults);
                      }
                  })
              }
})});


// GET - Modified from nodejs-starter-app to get Customer info to populate update form //
app.get('/get-customer-info', (req, res) => {
    const customerID = req.query.customerID;
    // Modified to select by customerID   
    db.pool.query('SELECT * FROM Customers WHERE customerID = ?', [customerID], (error, results) => {
        if (error){
            console.error('Error loading customer details', error);
        }
        // Check if customerID exists, if so assign to customer variable
        if (results.length > 0) {
            const customer = results[0];
            // send customer data associated with selected ID
            res.json({
                firstName: customer.firstName,
                lastName: customer.lastName,
                organization: customer.organization,
                email: customer.email,
                address: customer.address
            });
        } else {
            res.status(404).json({message: 'Customer not found'});
        }
    });
});


//  ORDERS //

// Read Orders //Modified from nodejs-starter-app 
app.get('/Orders', function(req, res) {  
    let query1;
    // Modified from nodejs-starter-app to check for filtering input
    if (!req.query['input-order-id'] || req.query['input-order-id'] === '') 
    {
        query1 = "SELECT * FROM Orders;";      // Return all from Orders, no ID selected         
    }
    else
    {
        query1 = `SELECT * FROM Orders WHERE orderID = ?`; // Return only Order with matching orderID
    }


    // Modified from nodejs-start-app, checks for input to pass to query or returns empty array 
    db.pool.query(query1, req.query['input-order-id'] ? [req.query['input-order-id']] : [], function(error, rows) {
        // Modified from nodejs-start-app, added more error handling
        if (error) {
            console.error('Database error:', error);
            return res.status(500).send("Error fetching orders");
        } else {
            // Added to gather customer info associated with customerID for dropdowns
            const orderquery2 = 'SELECT customerID, firstName, lastName FROM Customers ORDER BY customerID ASC;'
            db.pool.query(orderquery2, function(error, customers){
                // Added error handing if unable to find customerID
                if (error) {
                    console.error('Error fetching unique customer IDs:', error);
                    return res.status(500).send("Error fetching customer IDs");
                } else {
                    let orders = rows;
                    // Modified to return orders as data and customers
                    return res.render('Orders', {data: orders, customers: customers});  
                }
            })
        }
    })                
});                                                         


// Create Order // modified from nodejs-starter-app
app.post('/add-order-ajax', function(req, res) 
{
    // Taken from nodejs-starter-app
    let data = req.body;

    // Modified from nodejs-starter-app 
    let customerID;
    // Modified to check for null orderID
    if (customerID === "none") {
        customerID = null;
    } else {
        customerID = parseInt(data.customerID);
        if (isNaN(customerID)) {
            customerID = null;
        }
    }
    // Updated from nodejs-starter-app to reflect attribute names
    let orderDate = data.orderDate;

    let orderTotal = data.orderTotal


    //Modified from nodejs-starter-app - how values are handled was changed
    let query1 = `INSERT INTO Orders (customerID, orderDate, orderTotal) VALUES (?, ?, ?)`;    

    // Modified from nodejs-start-app provided - values passed to query, function now returns result
    db.pool.query(query1, [customerID, orderDate, orderTotal], function(error, result) {

        // Taken from nodejs-starter-app
        if (error) 
        {
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            let insertId = result.insertId;
            // Modified from nodejs-starter-app - select by orderID
            let query2 = `SELECT * FROM Orders WHERE orderID = ?;`;
            db.pool.query(query2, [insertId], function(error, rows){

                // Taken from nodejs-starter-app
                if (error) 
                {
                    console.log(error);
                    res.sendStatus(400);
                }
                else
                // Modified from nodejs-starter-app, sends new row
                {
                    res.send(rows[0]);
                }
            })
        }
    })
});

// Delete Order // Modified from nodejs-starter-app
app.delete('/delete-order-ajax/', function(req,res){
    let data = req.body;
    let orderID = parseInt(data.orderID);
    // Added to check for valid orderID
    if (!isNaN(orderID))
    {
        // Modified from nodejs-starter-app provided on git  
        let deleteOrderquery = `DELETE FROM Orders WHERE orderID = ?`;

        // Modified from nodejs-starter-app provided on git
        db.pool.query(deleteOrderquery, [orderID], function(error, rows, fields){
            // Taken from nodejs-starter-app
            if (error) 
            {
            console.log(error);
            res.sendStatus(400);
            } else 
            {
                // Added to reflect successful deletion
                res.sendStatus(200);
            }
        });
    }
    else
    {
        res.sendStatus(204);
    }
});


// Update Order// Modified from nodejs-starter-app
app.put('/put-order-ajax', function(req,res,next){
    // Taken from nodejs-starter-app
    let data = req.body;
  
    let orderID = parseInt(data.orderID);
    // Added to check for valid orderID
    if (isNaN(orderID))
    {
        console.log('orderID is not a valid number');
        res.sendStatus(400);
        return
    }
    let customerID;
    if (customerID === "none") {
        customerID = null;
    } else {
        customerID = parseInt(data.customerID);
        if (isNaN(customerID)) {
            customerID = null;
        }
    }

    let orderDate = data.orderDate;
    // Modified from nodejs-starter-app to reflect parse type as Float
    let orderTotal = parseFloat(data.orderTotal);
  
    // Modified from nodejs-starter-app to reflect table attributes
    let queryUpdateOrder = `UPDATE Orders SET customerID = ?, orderDate = ?, orderTotal = ? WHERE orderID = ?`;

          // Modified from nodejs-start-app provided on git
          db.pool.query(queryUpdateOrder, [customerID, orderDate, orderTotal, orderID], function(error, rows, fields){
              // Taken from nodejs-starter-app 
              if (error) 
              {
              console.log(error);
              res.sendStatus(400);
              }
              else
              {
                  // Modified from nodejs-start-app provided on git
                  let selectUpdatedRow = `SELECT * FROM Orders WHERE orderID = ?`;
                  // Modified from nodejs-start-app provided -  function now returns selectResults
                  db.pool.query(selectUpdatedRow, [orderID], function(selectError, selectResults) {
                     // Modified from nodejs-starter-app  changed error to selectError
                      if (selectError) 
                      {
                          console.log(selectError);
                          res.sendStatus(400);
                      } else 
                      {
                            res.json(selectResults)
                      }
                  })
              }
  })});


// GET Modified from nodejs-starter-app to get Order info to populate update form //
app.get('/get-order-info', (req, res) => {
    const orderID = req.query.orderID;
    // Modified to select by orderID 
    db.pool.query('SELECT * FROM Orders WHERE orderID = ?', [orderID], (error, results) => {
        if (error){
            console.error('Error loading order details', error);
        }
        // Check if orderID exists, if so assign to customer variable
        if (results.length > 0) {
            const order = results[0];
            // send order data associated with selected ID
            res.json({
                customerID: order.customerID,
                orderDate: order.orderDate,
                orderTotal: order.orderTotal
            });
        } else {
            res.status(404).json({message: 'Order not found'});
        }
    });
});


//  ORDER SCORES //

// Read Order Scores // Modified from nodejs-starter-app 
app.get('/Order_Scores', function(req, res) {  
    let query1;
    // Modified from nodejs-starter-app to check for filtering input
    if (!req.query['input-score-id'] || req.query['input-score-id'] === '') 
    {
        // Get scoreName from Scores table to display with scoreID
        query1 = `
        SELECT Order_Scores.*, Scores.scoreName
        FROM Order_Scores
        JOIN Scores ON Order_Scores.scoreID = Scores.scoreID`;              
    }
    else
    {
        // Get scoreName from Scores table to display with scoreID when filtering by scoreID
        query1 = `SELECT Order_Scores.*, Scores.scoreName
        FROM Order_Scores
        JOIN Scores ON Order_Scores.scoreID = Scores.scoreID
        WHERE Order_Scores.scoreID = ?`;
    }
    let query2 = "SELECT * FROM Orders;";

    let query3 = "SELECT * FROM Scores;";

    // Modified from nodejs-start-app - checks for input to pass to query or returns empty array 
    db.pool.query(query1, req.query['input-score-id'] ? [req.query['input-score-id']] : [], function(error, rows) {
        let order_scores = rows;
        // Modified from nodejs-start-ap,
        db.pool.query(query2, function(error, rows, fields){  
            let orders = rows;
            // Modified from nodejs-start-app
            db.pool.query(query3, function(error, rows, fields){
                let scores = rows;
                // Modified to return order_scores as data as well as orders and scores
                return res.render('Order_Scores', {data: order_scores, orders: orders, scores: scores});  
            })                
        })                                                      
    })
});                                                         


// Create Order Score// Modified from nodejs-start-app provided on git
app.post('/add-order-score-ajax', function(req, res) 
{
    // Taken from nodejs-starter-app
    let data = req.body;

    let orderID = parseInt(data.orderID);
    // Modified to check for null orderID
    if (isNaN(orderID))
    {
        orderID = null;
    }
    
    let scoreID = parseInt(data.scoreID);
    // Modified to check for null scoreID
    if (isNaN(scoreID))
    {
        scoreID = null;
    }

    let quantity = parseInt(data.quantity);
    // Modified to check for null quantity
    if (isNaN(quantity))
    {
        quantity = null;
    }

    let scoreType = data.scoreType;
    //Added to check for scoreType 
    if (!['paper', 'hard', 'digital'].includes(scoreType))
    {
        scoreType = null;
    }

    // Modified from nodejs-starter-app - how values are handled was changed
    let query1 = `INSERT INTO Order_Scores (orderID, scoreID, quantity, scoreType) VALUES (?, ?, ?, ?)`;    

    // Modified from nodejs-start-app provided - values passed to query, function now returns result
    db.pool.query(query1, [orderID, scoreID, quantity, scoreType], function(error, result) {

        // Taken from nodejs-starter-app
        if (error) 
        {
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // Modified from nodejs-starter-app
            let insertId = result.insertId;
            // Modified from nodejs-starter-app
            let query2 = `SELECT * FROM Order_Scores WHERE orderScoreID = ?;`;
            db.pool.query(query2, [insertId], function(error, rows){

                // Taken from nodejs-starter-app
                if (error) 
                {
                    console.log(error);
                    res.sendStatus(400);
                }
                else
                {
                    // Modified from nodejs-starter-app, sends new row
                    res.send(rows[0]);
                }
            })
        }
    })
});


// Delete Order Score // Modified from nodejs-starter-app provided on git
app.delete('/delete-OS-ajax/', function(req,res){
    let data = req.body;
    let orderScoreID = parseInt(data.orderScoreID);
    // Added to check for valid orderScoreID
    if (!isNaN(orderScoreID))
    {
        // Modified from nodejs-starter-app provided on git 
        let deleteOSquery = `DELETE FROM Order_Scores WHERE orderScoreID = ?`;

        // Modified from nodejs-start-app provided on git
        db.pool.query(deleteOSquery, [orderScoreID], function(error, rows, fields){
            // Taken from nodejs-starter-app
            if (error) 
            {
            console.log(error);
            res.sendStatus(400);
            } else 
            {
                // Added to reflect successful deletion
                res.sendStatus(200);
            }
        });
    }
    else
    {
        res.sendStatus(204);
    }
});


// Update Order Score // Modified from nodejs-start-app provided on git
app.put('/put-order-score-ajax', function(req,res,next){
    // Taken from nodejs-starter-app
    let data = req.body;
    // Modified variable names
    let orderScoreID = parseInt(data.orderScoreID);
    // Added to check for valid orderScoreID
    if (isNaN(orderScoreID))
    {
        console.log('orderScoreID is not a valid number');
        res.sendStatus(400);
        return;
    }
    // Modified variable names
    let scoreID = parseInt(data.scoreID);
    let quantity = parseInt(data.quantity);
    let scoreType = data.scoreType;

    // Modified from nodejs-starter-app to reflect table attributes
    let queryUpdateScore = `UPDATE Order_Scores SET scoreID = ?, quantity = ?, scoreType = ? WHERE orderScoreID = ?`;

          // Modified from nodejs-starter-app 
          db.pool.query(queryUpdateScore, [scoreID, quantity, scoreType, orderScoreID], function(error, rows, fields){
             // Taken from nodejs-starter-app   
            if (error) 
              {
              console.log(error);
              res.sendStatus(400);
              }
              else
              {
                  // Modified from nodejs-start-app provided on git
                  let selectUpdatedRow = `SELECT * FROM Order_Scores WHERE orderScoreID = ?`;
                  // Modified from nodejs-start-app provided -  function now returns selectResults
                  db.pool.query(selectUpdatedRow, [orderScoreID], function(selectError, selectResults) {
                      // Modified from nodejs-starter-app  changed error to selectError
                      if (selectError) 
                      {
                          console.log(selectError);
                          res.sendStatus(400);
                      } else 
                      {
                            res.json(selectResults);
                      }
                  })
              }
  })});


// GET Order Score info // Modified from nodejs-starter-app to get Order Score info to populate update form //
  app.get('/get-order-score-info', (req, res) => {
    const orderScoreID = req.query.orderScoreID;
   // Modified to select by orderScoreID  
    db.pool.query('SELECT * FROM Order_Scores WHERE orderScoreID = ?', [orderScoreID], (error, results) => {
        if (error){
            console.error('Error loading order details', error);
        }
        // Check if orderScoreID exists, if so assign to os variable
        if (results.length > 0) {
            const os = results[0];
            // send Order Score data associated with selected ID
            res.json({
                orderID: os.orderID,
                scoreID: os.scoreID,
                quantity: os.quantity,
                scoreType: os.scoreType
            });
        } else {
            res.status(404).json({message: 'Order Score not found'});
        }
    });
});


// SCORES //

// Read Scores // Modified from nodejs-starter-app
app.get('/Scores', function(req, res) {  

    // Modified from nodejs-starter-app
    let query1 = "SELECT * FROM Scores;";

    // Modified from nodejs-starter-app
    db.pool.query(query1, function(error, rows, fields){    
        // Modified to return Score rows
        res.render('Scores', {data: rows});
    
    })
}); 

// Create Score // Modified from nodejs-starter-app 
app.post('/add-score-ajax', function(req, res) 
{
    // Taken from nodejs-starter-app 
    let data = req.body;

    // Modified from nodejs-starter-app
    let scoreName = data.scoreName;

    let paperPrice = parseInt(data.paperPrice);
    // Modified to check for null paperPrice
    if (isNaN(paperPrice))
    {
        paperPrice = null;
    }

    let hardPrice = parseInt(data.hardPrice);
    // Modified to check for null hardPrice
    if (isNaN(hardPrice))
    {
        hardPrice = null;
    }

    let digiPrice = parseInt(data.digiPrice);
    // Modified to check for null digiPrice
    if (isNaN(digiPrice))
    {
        digiPrice = null;
    }

    //Modified from nodejs-starter-app - how values are handled was changed
    let query1 = `INSERT INTO Scores (scoreName, paperPrice, hardPrice, digiPrice) VALUES (?, ?, ?, ?)`;    

    // Modified from nodejs-start-app - values passed to query, function now returns result
    db.pool.query(query1, [scoreName, paperPrice, hardPrice, digiPrice], function(error, result) {
         // Taken from nodejs-starter-app
        if (error) 
        {

            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            let insertId = result.insertId;
            // Modified from nodejs-starter-app - select by scoreID
            let query2 = `SELECT * FROM Scores WHERE scoreID = ?;`;
            console.log({ scoreName, paperPrice, hardPrice, digiPrice });
            db.pool.query(query2, [insertId], function(error, rows){
                // Taken from nodejs-starter-app
                if (error) 
                {
                    console.log(error);
                    res.sendStatus(400);
                }
                else
                {
                    // Modified from nodejs-starter-app, sends new row
                   res.send(rows[0]);
                }
            })
        }
    })
});

// Delete Score // Modified from nodejs-starter-app
app.delete('/delete-score-ajax/', function(req,res){
    let data = req.body;
    let scoreID = parseInt(data.scoreID);
    // Added to check for valid scoreID
    if (!isNaN(scoreID))
    {
        // Modified from nodejs-starter-app provided on git 
        let deleteOSquery = `DELETE FROM Scores WHERE scoreID = ?`;

        // Modified from nodejs-start-app provided on git
        db.pool.query(deleteOSquery, [scoreID], function(error, rows, fields){
            // Taken from nodejs-starter-app
            if (error) 
            {
            console.log(error);
            res.sendStatus(400);
            } else 
            {
                // Added to reflect successful deletion
                res.sendStatus(200);
            }
        });
    }
    else
    {
        res.sendStatus(204);
    }
});


// Update Score // Modified from nodejs-starter-app
app.put('/put-score-ajax', function(req,res,next){
    // Taken from nodejs-starter-app
    let data = req.body;
  
    let scoreID = parseInt(data.scoreID);
    // Added to check for valid scoreID
    if (isNaN(scoreID))
    {
        console.log('scoreID is not a valid number');
        res.sendStatus(400);
        return
    }
    // Modified from nodejs-starter-app
    let scoreName = data.scoreName;
    let paperPrice = parseInt(data.paperPrice);
    let hardPrice = parseInt(data.hardPrice);
    let digiPrice = parseInt(data.digiPrice);
  
    // Modified from nodejs-starter-app to reflect table attributes
    let queryUpdateScore = `UPDATE Scores SET scoreName = ?, paperPrice = ?, hardPrice = ?, digiPrice = ? WHERE scoreID = ?`;

          // Modified from nodejs-start-app provided on git
          db.pool.query(queryUpdateScore, [scoreName, paperPrice, hardPrice, digiPrice, scoreID], function(error, rows, fields){
              // Taken from nodejs-starter-app
              if (error) 
              {
              console.log(error);
              res.sendStatus(400);
              }
              else
              {
                  // Modified from nodejs-start-app  - selects by scoreID
                  let selectUpdatedRow = `SELECT * FROM Scores WHERE scoreID = ?`;
                  // Modified from nodejs-start-app provided -  function now returns selectResults
                  db.pool.query(selectUpdatedRow, [scoreID], function(selectError, selectResults) {
                      // Modified from nodejs-starter-app  changed error to selectError
                      if (selectError) 
                      {
                          console.log(selectError);
                          res.sendStatus(400);
                      } else 
                      {
                            res.json(selectResults);
                      }
                  })
              }
  })});

  // GET Score info // Modified from nodejs-starter-app to get Score info to populate update form //
  app.get('/get-score-info', (req, res) => {
    const scoreID = req.query.scoreID;
    // Modified to select by scoreID 
    db.pool.query('SELECT * FROM Scores WHERE scoreID = ?', [scoreID], (error, results) => {
        if (error){
            console.error('Error loading score details', error);
        }
        // Check if scoreID exists, if so assign to score variable
        if (results.length > 0) {
            const score = results[0];
            // send score data associated with selected ID
            res.json({

                scoreName: score.scoreName,
                paperPrice: score.paperPrice,
                hardPrice: score.hardPrice,
                digiPrice: score.digiPrice,

            });
        } else {
            res.status(404).json({message: 'Score not found'});
        }
    });
});


//  COMPOSERS //

// Read Composers // Modified from nodejs-starter-app 
app.get('/Composers', function(req, res) {  
    // Modified from nodejs-starter-app
    let query1 = "SELECT * FROM Composers;";

    // Modified from nodejs-starter-app to render Composers
    db.pool.query(query1, function(error, rows, fields){    

        res.render('Composers', {data: rows});
    })
}); 

// READ // Search for Scores associated with a Composer 
app.get('/fetch-scores-by-composer', function(req, res) {
    const composerID = req.query.composerID;
    // Get scoreName from Scores table and join with scoreID from Composer_Scores table
    const query = `SELECT s.scoreName FROM Composer_Scores cs
                   JOIN Scores s ON cs.scoreID = s.scoreID
                   WHERE cs.composerID = ?`;

    // Modified from nodejs-start-app               
    db.pool.query(query, [composerID], function(error, results) {
        if(error) {
            console.log(error);
            res.status(500).send('Error fetching scores for composer');
        } else {
            res.json(results);
        }
    });
});


// Create Composer// Modified from nodejs-start-app provided on git
app.post('/add-composer-ajax', function(req, res) 
{
    // Taken from nodejs-starter-app
    let data = req.body;

    // Modified from nodejs-start-app
    let composerFirst = data.composerFirst;

    let composerLast = data.composerLast;

    // Modified from nodejs-starter-app - how values are handled was changed
    let query1 = `INSERT INTO Composers (composerFirst, composerLast) VALUES (?, ?)`;    

    // Modified from nodejs-start-app provided - values passed to query, function now returns result
    db.pool.query(query1, [composerFirst, composerLast], function(error, result) {
        if (error) 
        {
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // Modified from nodejs-start-app provided
            let insertId = result.insertId;
            let query2 = `SELECT * FROM Composers WHERE composerID = ?;`;
            // Modified from nodejs-start-app
            db.pool.query(query2, [insertId], function(error, rows){
                // Taken from nodejs-starter-app
                if (error) 
                {
                    console.log(error);
                    res.sendStatus(400);
                }
                else
                {
                   // Modified from nodejs-starter-app, sends new row
                   res.send(rows[0]);
                }
            })
        }
    })
});

// Delete Composer // Modified from nodejs-starter-app provided on git
app.delete('/delete-composer-ajax/', function(req,res){
    // Taken from nodejs-starter-app
    let data = req.body;
    // Modified from nodejs-starter-app
    let composerID = parseInt(data.composerID);
    // Added to check for valid composerID
    if (!isNaN(composerID))
    {
        // Modified from nodejs-starter-app provided on git 
        let deleteOSquery = `DELETE FROM Composers WHERE composerID = ?`;

        // Modified from nodejs-start-app provided on git
        db.pool.query(deleteOSquery, [composerID], function(error, rows, fields){
            // Taken from nodejs-starter-app
            if (error) 
            {
            console.log(error);
            res.sendStatus(400);
            } else 
            {
                // Added to reflect successful deletion
                res.sendStatus(200);
            }
        });
    }
    else
    {
        res.sendStatus(204);
    }
});

// Update Composer // Modified from nodejs-start-app provided on git
app.put('/put-composer-ajax', function(req,res,next){
    // Taken from nodejs-starter-app
    let data = req.body;
    // Modified variable names
    let composerID = parseInt(data.composerID);
    // Added to check for valid composerID
    if (isNaN(composerID))
    {
        console.log('composerID is not a valid number');
        res.sendStatus(400);
        return;
    }
    // Modified variable names
    let composerFirst = data.composerFirst;
    let composerLast = data.composerLast;

    // Modified from nodejs-starter-app to reflect table attributes
    let queryUpdateComposer = `UPDATE Composers SET composerFirst = ?, composerLast = ? WHERE composerID = ?`;

          // Modified from nodejs-start-app provided on git
          db.pool.query(queryUpdateComposer, [composerFirst, composerLast, composerID], function(error, rows, fields){
              // Taken from nodejs-starter-app
              if (error) 
              {
              console.log(error);
              res.sendStatus(400);
              }
              else
              {
                  // Modified from nodejs-start-app provided on git
                  let selectUpdatedRow = `SELECT * FROM Composers WHERE composerID = ?`;
                  // Modified from nodejs-start-app provided -  function now returns selectResults
                  db.pool.query(selectUpdatedRow, [composerID], function(selectError, selectResults) {
                      // Modified from nodejs-starter-app  changed error to selectError
                      if (selectError) 
                      {
                          console.log(selectError);
                          res.sendStatus(400);
                      } else 
                      {
                            res.json(selectResults);
                      }
                  })
              }
  })});


// GET Composer info // Modified from nodejs-starter-app to get Order Score info to populate update form //
app.get('/get-composer-info', (req, res) => {
    const composerID = req.query.composerID;
    // Modified to select by composerID 
    db.pool.query('SELECT * FROM Composers WHERE composerID = ?', [composerID], (error, results) => {
        if (error){
            console.error('Error loading composer details', error);
        }
        // Check if composerID exists, if so assign to composer variable
        if (results.length > 0) {
            const composer = results[0];
            // send Composer data associated with selected ID
            res.json({
                composerFirst: composer.composerFirst,
                composerLast: composer.composerLast
            });
        } else {
            res.status(404).json({message: 'Composer not found'});
        }
    });
});


// COMPOSER SCORES //

// Read Composer Scores // Modified from nodejs-starter-app
app.get('/Composer_Scores', function(req, res) {  

    let query1;
    // Modified from nodejs-starter-app to check for filtering input
    if (!req.query['input-composer-score-id'] || req.query['input-composer-score-id'] === '') 
    {
        // Get composerID from Composers table and scoreIDs from Scores table
        query1 = `
        SELECT * FROM Composer_Scores
        JOIN Composers ON Composer_Scores.composerID = Composers.composerID
        JOIN Scores ON Composer_Scores.scoreID = Scores.scoreID
        ORDER BY composerScoreID ASC`    }
    else
    {
        // Modified from nodejs-starter-app
        query1 = `SELECT * FROM Composer_Scores WHERE scoreID = ?`;
    }
    let query2 = "SELECT * FROM Composers;";

    let query3 = "SELECT * FROM Scores;";

    // Modified from nodejs-start-app provided on git
    db.pool.query(query1, req.query['input-score-id'] ? [req.query['input-score-id']] : [], function(error, rows) {
        let composer_scores = rows;

        // Modified from nodejs-starter-app 
        db.pool.query(query2, function(error, rows, fields){  
            let composers = rows;
            
            // Modified from nodejs-starter-app 
            db.pool.query(query3, function(error, rows, fields){
                let scores = rows;
                // Modified to return composer_scores as data as well as composers and scores
                return res.render('Composer_Scores', {data: composer_scores, composers: composers, scores: scores});  
            })                
        })                                                      
    })
});   

// Create Composer Score // Modified from nodejs-start-app provided on git
app.post('/add-composer-score-ajax', function(req, res) 
{
    // Taken from nodejs-starter-app
    let data = req.body;

    // Modified from nodejs-starter-app
    let composerID = parseInt(data.composerID);
    // Modified to check for null composerID
    if (isNaN(composerID))
    {
        composerID = null;
    }

    // Modified from nodejs-starter-app
    let scoreID = parseInt(data.scoreID);
    // Modified to check for null scoreID
    if (isNaN(scoreID))
    {
        scoreID = null;
    }
    // Modified from nodejs-starter-app - how values are handled was changed
    let query1 = `INSERT INTO Composer_Scores (composerID, scoreID) VALUES (?, ?)`;    

    // Modified from nodejs-start-app - values passed to query, function now returns result
    db.pool.query(query1, [composerID, scoreID], function(error, result) {
        // Taken from nodejs-starter-app
        if (error) 
        {
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // Modified from nodejs-starter-app
            let insertId = result.insertId;
            // Modified from nodejs-starter-app
            let query2 = `SELECT * FROM Composer_Scores WHERE composerScoreID = ?;`;
            // Modified from nodejs-starter-app
            db.pool.query(query2, [insertId], function(error, rows){
                // Taken from nodejs-starter-app
                if (error) 
                {
                    console.log(error);
                    res.sendStatus(400);
                }
                else
                {
                    // Modified from nodejs-starter-app, sends new row
                   res.send(rows[0]);
                }
            })
        }
    })
});
 

// Delete Composer Score // Modified from nodejs-starter-app provided on git
app.delete('/delete-composer-score-ajax/', function(req,res){
    let data = req.body;
    let composerScoreID = parseInt(data.composerScoreID);
     // Added to check for valid composerScoreID
    if (!isNaN(composerScoreID))
    {
        // Modified from nodejs-starter-app provided on git
        let deleteOSquery = `DELETE FROM Composer_Scores WHERE composerScoreID = ?`;

        // Modified from nodejs-start-app provided on git
        db.pool.query(deleteOSquery, [composerScoreID], function(error, rows, fields){
            // Taken from nodejs-starter-app
            if (error) 
            {
            console.log(error);
            res.sendStatus(400);
            } else 
            {
                // Added to reflect successful deletion
                res.sendStatus(200);
            }
        });
    }
    else
    {
        res.sendStatus(204);
    }
});

// Update Composer Score // Modified from nodejs-start-app provided on git
app.put('/put-composer-score-ajax', function(req,res,next){
    // Taken from nodejs-starter-app
    let data = req.body;
  
    let composerScoreID = parseInt(data.composerScoreID);
    if (isNaN(composerScoreID))
    {
        console.log('composerScoreID is not a valid number');
        res.sendStatus(400);
        return
    }
    let composerID = parseInt(data.composerID);
    let scoreID = parseInt(data.scoreID);
  
    let queryUpdateComposerScore = `UPDATE Composer_Scores SET composerID = ?, scoreID = ? WHERE composerScoreID = ?`;

  
          // Run the 1st query
          // Modified from nodejs-start-app provided on git
          db.pool.query(queryUpdateComposerScore, [composerID, scoreID, composerScoreID], function(error, rows, fields){
              // Taken from nodejs-starter-app
              if (error) 
              {
              console.log(error);
              res.sendStatus(400);
              }
              else
              {
                  // Modified from nodejs-start-app provided on git
                  let selectUpdatedRow = `SELECT * FROM Composer_Scores WHERE composerScoreID = ?`;
                  // Modified from nodejs-start-app provided -  function now returns selectResults
                  db.pool.query(selectUpdatedRow, [composerScoreID], function(selectError, selectResults) {
                      // Modified from nodejs-starter-app  changed error to selectError
                      if (selectError) 
                      {
                          console.log(selectError);
                          res.sendStatus(400);
                      } else 
                      {
                            res.json(selectResults);
                      }
                  })
              }
  })});


  // GET Composer Score info // Modified from nodejs-starter-app to get Composer Score info to populate update form //
  app.get('/get-composer-score-info', (req, res) => {
    const composerScoreID = req.query.composerScoreID;
    // Modified to select by composerScoreID 
    db.pool.query('SELECT * FROM Composer_Scores WHERE composerScoreID = ?', [composerScoreID], (error, results) => {
        if (error){
            console.error('Error loading composer score details', error);
        }
        // Check if composerScoreID exists, if so assign to composerScore variable
        if (results.length > 0) {
            const composerScore = results[0];
            // send Composer Score data associated with selected ID
            res.json({
                composerID: composerScore.composerID,
                scoreID: composerScore.scoreID
            });
        } else {
            res.status(404).json({message: 'Composer Score not found'});
        }
    });
});


/*
    LISTENER
*/


// Taken from nodejs-start-app provided on git

app.listen(PORT, function(){          
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});
