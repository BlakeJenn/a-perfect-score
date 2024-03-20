/*
Authors: Erin McBride and Blake Jennings
Updated on 03/17/2024
CS_340
Group 170
*/

-- Disable foreign key checks and commits --
SET FOREIGN_KEY_CHECKS=0;
SET AUTOCOMMIT = 0;

-- Create Customers Table --
CREATE OR REPLACE TABLE Customers (
    customerID int NOT NULL UNIQUE AUTO_INCREMENT,
    firstName varchar(45)NOT NULL,
    lastName varchar(45) NOT NULL,
    organization varchar(45),
    email varchar(250) NOT NULL,
    address varchar(250),
    PRIMARY KEY (customerID)
);

-- Insert into Customers Table --
INSERT INTO Customers( firstName, lastName, organization, email, address) 
VALUES ('Jim', 'Smith', "Jim's Musical Majesty", 'jims@hotmail.com', '1103 Godfrey Road, New York, NY 10029'),
('Miranda', 'Caldera', 'NYU', 'miracal@NYU.edu', '3880 Farnum Road, New York, NY 10031'),
('Bobby', 'Hill', 'The Manger Babies','bobbyhill@hotmail.com', '5295 Rainey St, Arlen, TX, 75693'),
('Elizabeth', 'Knowles', 'Houston Grand Opera','LizK@hgo.com', '341 Sam Street, Houston, TX, 72984'),
('Zach', 'Joplin', 'Boston Lyric Theatre','Zjop@blt.com', '1824 Commonwealth Ave, Boston, MA, 00124')
;

-- Create Orders Table --
CREATE OR REPLACE TABLE Orders (
    orderID int NOT NULL UNIQUE AUTO_INCREMENT,
    customerID int NULL,
    orderDate date NOT NULL,
    orderTotal decimal(10,2),
    PRIMARY KEY (orderID),
    FOREIGN KEY(customerID) REFERENCES Customers(customerID) ON DELETE CASCADE 
);

-- Insert Data into Orders Table
INSERT INTO Orders(customerID, orderDate, orderTotal)
VALUES (2, 20240205, 2200.00),
(3, 20240206, 875.00),
(1, 20240207, 500.00),
(NULL, 20240308, 550.00),
(4, 20240310, 3000.00);


-- Create Scores Table --
CREATE OR REPLACE TABLE Scores (
	scoreID int NOT NULL UNIQUE AUTO_INCREMENT,
	scoreName varchar(145) NOT NULL,
	paperPrice decimal(10,2) NOT NULL,
    hardPrice decimal(10,2) NOT NULL,
    digiPrice decimal(10,2) NOT NULL,
    PRIMARY KEY (scoreID)
);

-- Insert into Scores Table --
INSERT INTO Scores(scoreName, paperPrice, hardPrice, digiPrice)
VALUES ('La Traviata', 30.00, 45.00, 10.00),
('Wicked', 32.00, 55.00, 18.00),
('Into The Woods', 35.00, 60.00, 20.00),
('The Last 5 Years', 40.00, 65.00, 30.00),
('Aida', 25.00, 45.00, 9.00);


-- Create Order_Scores Table --
CREATE OR REPLACE TABLE Order_Scores (
    orderScoreID int NOT NULL UNIQUE AUTO_INCREMENT,
    orderID int NOT NULL,
    scoreID int NOT NULL,
    quantity int NOT NULL,
    scoreType varchar(10) NOT NULL,
    PRIMARY KEY (orderScoreID),
    FOREIGN KEY(orderID) REFERENCES Orders(orderID) ON DELETE CASCADE,
    FOREIGN KEY(scoreID) REFERENCES Scores(scoreID) ON DELETE CASCADE
);


-- Create Composers Table --
CREATE OR REPLACE TABLE Composers(
	composerID int NOT NULL UNIQUE AUTO_INCREMENT,
	composerFirst varchar(45) NOT NULL,
	composerLast varchar(45) NOT NULL,
	PRIMARY KEY(composerID)
);

-- Insert Data into Composers Table
INSERT INTO Composers (composerFirst, composerLast)
VALUES ('Stephen', 'Sondheim'),
('Giuseppe', 'Verdi'),
('Stephen', 'Schwartz'),
('Jason', 'Brown')
;

-- Create Composer_Scores Table --
CREATE OR REPLACE TABLE Composer_Scores(
	composerScoreID int NOT NULL UNIQUE AUTO_INCREMENT,
	composerID int NOT NULL,
    scoreID int NOT NULL,
	PRIMARY KEY(composerScoreID),
    FOREIGN KEY(composerID) REFERENCES Composers(composerID) ON DELETE CASCADE,
    FOREIGN KEY(scoreID) REFERENCES Scores(scoreID) ON DELETE CASCADE
);

-- Insert Data into Composer_Scores Table --
INSERT INTO Composer_Scores(composerID, scoreID)
VALUES (1, 3), (2, 1), (3, 2), (4, 4), (2, 5);


-- Insert Data into Order_Scores Table --
INSERT INTO Order_Scores (orderID, scoreID, quantity, scoreType)
VALUES 
(1, 1, 40, 'hard'),
(2, 2, 25, 'paper'),
(3, 3, 50, 'digital'),
(5, 1, 100, 'paper');



-- Enable foreign key checks and commits
SET FOREIGN_KEY_CHECKS=1;
COMMIT;