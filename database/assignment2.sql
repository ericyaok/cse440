--Task 1
INSERT INTO account(account_firstname,account_lastname,account_email,account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

--Task 2
UPDATE account
SET account_type = 'Admin'
WHERE account_id = 1;

--Task 3
DELETE FROM account
WHERE account_id = 1;

--Task 4
UPDATE inventory
SET inv_description = replace(inv_description,'small interiors','a huge interior')
WHERE inv_model = 'Hummer';

--Task 5
SELECT inv_make,inv_model, classification_name
FROM inventory
INNER JOIN classification
ON inventory.classification_id = classification.classification_id
WHERE classification.classification_name = 'Sport'; 

--Task 6
UPDATE inventory
SET 
    inv_image = substring(inv_image FROM 1 FOR 7) || '/vehicles' || substring(inv_image FROM 8),
    inv_thumbnail = substring(inv_thumbnail FROM 1 FOR 7) || '/vehicles' || substring(inv_thumbnail FROM 8);

