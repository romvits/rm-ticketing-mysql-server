DROP USER IF EXISTS 'ticketing_user';
CREATE USER 'ticketing_user' IDENTIFIED WITH mysql_native_password BY 'Passw0Rd!';
GRANT ALL ON ticketing_db.* TO 'ticketing_user';
FLUSH PRIVILEGES;
