
/*Stored Procedure for update an user.*/
DELIMITER $$
USE `restaurant`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_update_users`(pName varchar(50), pName varchar(50),pLastName varchar(50), pAgee int, pNumber varchar(50), 
pEmail varchar(60), pPassword varchar(90), pRol varchar(50), pState varchar(10), pCurrentUser varchar(50))
BEGIN
	UPDATE users set name=pName, lastname=pLastName, age=pAgee, number=pNumber, email=pEmail, password=pPassword, rol=pRol, state=pState where username=pCurrentUser;
END$$
DELIMITER ;;