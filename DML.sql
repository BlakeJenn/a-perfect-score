/*
Authors: Erin McBride and Blake Jennings
02/15/2024
CS_340
*/
------ INSERT ------

-- Add a new customer --
INSERT INTO Customers(firstName, lastName, organization, email, address) 
   VALUES (:firstNameInput, :lastNameInput, :organizationInput, :emailInput, :addressInput)

-- Add a new order --
INSERT INTO Orders(customerID, orderDate, orderTotal) 
   VALUES (:customerIDInput, :orderDateInput, :orderTotalInput)

-- Add a new score --
INSERT INTO Scores(scoreID, scoreName, composerID, paperPrice, hardPrice, digiPrice) 
   VALUES (:scoreIDInput, :scoreNameInput, :composerIDInput, :paperPriceInput, :hardPriceInput, :digiPriceInput)

-- Add a new composer --
INSERT INTO Composers(composerID, composerFirst, composerLast) 
   VALUES (:composerIDInput, :composerFirstInput, :composerLastInput)

-- Add a new realtionship between a composer and a score --
INSERT INTO Composer_Scores(composerScoreID, composerID, scoreID) 
VALUES (:composerScoreIDInput, :composerIDInput, :scoreIDInput)

-- Add a instance of a score being ordered --
INSERT INTO Order_Scores(orderScoreID, orderID, scoreID, quantity, scoreType) 
VALUES (:orderScoreIDInput, :orderIDInput, :scoreIDInput, :quantityInput, :scoreTypeInput)


------ UPDATE ------

-- update a customer's data --
UPDATE Customers SET firstName= :firstNameInput, lastName= :lastNameInput, organization= :organizationInput, email= :emailInput, address= :addressInput 
WHERE id= :customerID_selected

-- update data for a specific order --
UPDATE Orders SET customerID= :customerIDInput, orderDate= :orderDateInput, orderTotal= :orderTotalInput
WHERE id= :orderID

-- update information about a score --
UPDATE Scores SET scoreName= :scoreNameInput, composerID= :composerIDInput, paperPrice= :paperPriceInput, hardPrice= :hardPriceInput, digiPrice= :digiPriceInput
WHERE id= :scoreID_selected

-- update a composer's data --
UPDATE Composers SET  composerFirst= :composerFirstInputnput, composerLast = :composerLastInput
WHERE id= :composerID_selected

-- update a relationship between composer and score --
UPDATE Composer_Scores SET  composerID= :composerIDInput, scoreID = :scoreIDInput
WHERE id= :composerScoreID

-- update relationship between an order and a score --
UPDATE Order_Scores SET orderID= :orderIDInput, scoreID = :scoreIDInput, quantity = :quantityInput,
(select scoreType from Order_Scores where orderScoreID = :orderScoreIDInput),
WHERE id= :orderScoreID


------ DELETE ------

-- Delete a customer --
DELETE FROM Customers WHERE id= :customerID_selected

-- Delete an order --
DELETE FROM Orders WHERE id= :orderID_selected

-- Delete an instance of an score in an order --
DELETE FROM Order_Scores WHERE id= :orderScoreID_selected

-- Delete a score --
DELETE FROM Scores WHERE id= :scoreID_selected

-- Delete a composer --
DELETE FROM Composers WHERE id= :composerID_selected

-- Delete a composer_score --
DELETE FROM Composer_Scores WHERE id= :composerScoreID_selected;

------ READ ------

SELECT customerID, firstName, lastName, organization, email, address FROM Customers;

SELECT orderID, Customers.customerID, orderDate, orderTotal FROM Orders
JOIN Customers ON Orders.customerID = Customers.customerID;

SELECT scoreID, scoreName, Composers.composerID, paperPrice, hardPrice, digiPrice FROM Scores
JOIN Composers ON Scores.composerID = Composers.composerID;

SELECT orderScoreID, Orders.orderID, Scores.scoreID, quantity, itemType FROM Order_Scores
JOIN Orders ON Order_Scores.orderID = Orders.orderID
JOIN Scores ON Order_Scores.scoreID = Scores.scoreID;

SELECT composerID, composerFirst, composerLast FROM Composers;

SELECT composerScoreID, Composers.composerID, Scores.scoreID FROM Composer_Scores
JOIN Composers ON Composer_Scores.composerID = Composers.composerID
JOIN Scores ON Composer_Scores.scoreID = Scores.scoreID;


---------------------- ADDED 2/27 as possible code -------------------

-- CALCULATE orderTotal --

SELECT O.orderID, O.customerID, O.orderDate, 
   (SELECT SUM(
      OS.quantity * 
      CASE OS.scoreType
         WHEN 'paper' THEN S.paperPrice
         WHEN 'hard' THEN S.hardPrice
         WHEN 'digi' THEN S.digiPrice
      END
   )
   FROM Order_Scores OS
   JOIN Scores S ON OS.scoreID = S.scoreID
   WHERE OS.orderID = O.orderID) AS orderTotal
FROM Orders O; 

-- Add a new order --
INSERT INTO Orders(customerID, orderDate, orderTotal) 
   VALUES (:customerID_from, :orderDateInput, :orderTotalInput)


SELECT Orders.orderID, Customers.customerID, Orders.orderDate, Orders.orderTotal
FROM Orders
JOIN Customers ON Orders.customerID = Customers.customerID;


INSERT INTO Orders(customerID, orderDate, orderTotal)
VALUES (:customerID_selected, :orderDate_input, :orderTotal_input)