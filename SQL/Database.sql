-- ----------------------------------------------------------------------------
-- MySQL Workbench Migration
-- Migrated Schemata: Restaurant
-- Source Schemata: Restaurant
-- Created: Fri Feb 11 17:58:12 2022
-- Workbench Version: 8.0.28
-- ----------------------------------------------------------------------------

SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------------------------------------------------------
-- Schema Restaurant
-- ----------------------------------------------------------------------------
DROP SCHEMA IF EXISTS `Restaurant` ;
CREATE SCHEMA IF NOT EXISTS `Restaurant` ;

-- ----------------------------------------------------------------------------
-- Table Restaurant.Users
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `Restaurant`.`Users` (
  `username` VARCHAR(30) NOT NULL,
  `name` VARCHAR(30) NULL,
  `lastname` VARCHAR(30) NULL,
  `age` INT NULL,
  `number` VARCHAR(15) NULL,
  `email` VARCHAR(50) NULL,
  `password` VARCHAR(64) NULL,
  `rol` VARCHAR(20) NULL,
  `state` VARCHAR(20) NULL,
  PRIMARY KEY (`username`));

-- ----------------------------------------------------------------------------
-- Table Restaurant.Suppliers
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `Restaurant`.`Suppliers` (
  `idSupplier` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NULL,
  `location` VARCHAR(60) NULL,
  `number` VARCHAR(15) NULL,
  `email` VARCHAR(30) NULL,
  `state` VARCHAR(20) NULL,
  PRIMARY KEY (`idSupplier`));

-- ----------------------------------------------------------------------------
-- Table Restaurant.SaleProducts
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `Restaurant`.`SaleProducts` (
  `idSaleProduct` INT NOT NULL AUTO_INCREMENT ,
  `name` VARCHAR(25) NULL,
  `price` DECIMAL(19,4) NULL,
  `idCategoria` INT NOT NULL,
  `state` VARCHAR(20) NULL,
  PRIMARY KEY (`idSaleProduct`),
  CONSTRAINT `FK__Productos__idCat__3E52440B`
    FOREIGN KEY (`idCategoria`)
    REFERENCES `Restaurant`.`Categorias` (`idCategoria`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

-- ----------------------------------------------------------------------------
-- Table Restaurant.PurchaseProducts
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `Restaurant`.`PurchaseProducts` (
  `idPurchaseProduct` INT NOT NULL AUTO_INCREMENT ,
  `name` VARCHAR(25) NULL,
  `price` DECIMAL(19,4) NULL,
  `idSupplier` INT NULL,
  `idCategoria` INT NOT NULL,
  `state` VARCHAR(20) NULL,
  PRIMARY KEY (`idPurchaseProduct`),
  CONSTRAINT `FK__Productos__idPro__2A4B4B5E`
    FOREIGN KEY (`idSupplier`)
    REFERENCES `Restaurant`.`Suppliers` (`idSupplier`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `FK__Productos__idCat__3F466844`
    FOREIGN KEY (`idCategoria`)
    REFERENCES `Restaurant`.`Categorias` (`idCategoria`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

-- ----------------------------------------------------------------------------
-- Table Restaurant.Sales
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `Restaurant`.`Sales` (
  `idSale` INT NOT NULL AUTO_INCREMENT ,
  `date` DATETIME(6) NULL,
  `amount` DECIMAL(19,4) NULL,
  `state` VARCHAR(15) NULL,
  `username` VARCHAR(30) NULL,
  `NumMesa` INT NULL,
  PRIMARY KEY (`idSale`),
  CONSTRAINT `FK__Sales__namede__2D27B809`
    FOREIGN KEY (`username`)
    REFERENCES `Restaurant`.`Usuarios` (`username`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

-- ----------------------------------------------------------------------------
-- Table Restaurant.SaleDetails
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `Restaurant`.`SaleDetails` (
  `idSaleDetails` INT NOT NULL AUTO_INCREMENT ,
  `idSaleProduct` INT NULL,
  `price` DOUBLE NULL,
  `quantity` INT NULL,
  `total` DECIMAL(19,4) NULL,
  `idSale` INT NULL,
  PRIMARY KEY (`idSaleDetails`),
  CONSTRAINT `FK__DetallesV__idPro__300424B4`
    FOREIGN KEY (`idSaleProduct`)
    REFERENCES `Restaurant`.`SaleProducts` (`idSaleProduct`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `FK__DetallesV__idVen__30F848ED`
    FOREIGN KEY (`idSale`)
    REFERENCES `Restaurant`.`Sales` (`idSale`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

-- ----------------------------------------------------------------------------
-- Table Restaurant.Compraas
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `Restaurant`.`Purchases` (
  `idPurchase` INT NOT NULL AUTO_INCREMENT ,
  `date` DATE NULL,
  `amount` DECIMAL(19,4) NULL,
  `idSupplier` INT NULL,
  `username` VARCHAR(30) NULL,
  PRIMARY KEY (`idPurchase`),
  CONSTRAINT `FK__Compraas__idProv__33D4B598`
    FOREIGN KEY (`idSupplier`)
    REFERENCES `Restaurant`.`Suppliers` (`idSupplier`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `FK__Compraas__name__34C8D9D1`
    FOREIGN KEY (`username`)
    REFERENCES `Restaurant`.`Usuarios` (`username`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

-- ----------------------------------------------------------------------------
-- Table Restaurant.PurchaseDetails
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `Restaurant`.`PurchaseDetails` (
  `idPurchaseDetails` INT NOT NULL AUTO_INCREMENT ,
  `idPurchaseProduct` INT NULL,
  `price` DOUBLE NULL,
  `quantity` INT NULL,
  `amount` DECIMAL(19,4) NULL,
  `idPurchase` INT NULL,
  PRIMARY KEY (`idPurchaseDetails`),
  CONSTRAINT `FK__DetallesC__idPro__37A5467C`
    FOREIGN KEY (`idPurchaseProduct`)
    REFERENCES `Restaurant`.`PurchaseProducts` (`idPurchaseProduct`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `FK__DetallesC__idCom__38996AB5`
    FOREIGN KEY (`idPurchase`)
    REFERENCES `Restaurant`.`Compraas` (`idPurchase`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

-- ----------------------------------------------------------------------------
-- Table Restaurant.Almacen
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `Restaurant`.`Almacen` (
  `idAlmacen` INT NOT NULL AUTO_INCREMENT ,
  `idPurchaseProduct` INT NULL,
  `cantidadDisponible` DOUBLE NULL,
  PRIMARY KEY (`idAlmacen`),
  CONSTRAINT `FK__Almacen__idProdu__3B75D760`
    FOREIGN KEY (`idPurchaseProduct`)
    REFERENCES `Restaurant`.`PurchaseProducts` (`idPurchaseProduct`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

-- ----------------------------------------------------------------------------
-- Table Restaurant.Categorias
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `Restaurant`.`Categorias` (
  `idCategoria` INT NOT NULL AUTO_INCREMENT,
  `nameCategoria` VARCHAR(50) NULL,
  `state` VARCHAR(20) NULL,
  PRIMARY KEY (`idCategoria`));

-- ----------------------------------------------------------------------------
-- Table Restaurant.Recetas
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `Restaurant`.`Recetas` (
  `idReceta` INT NOT NULL AUTO_INCREMENT,
  `idSaleProduct` INT NULL,
  `idPurchaseProduct` INT NULL,
  `cantidadProdIngrediente` INT NULL,
  PRIMARY KEY (`idReceta`),
  CONSTRAINT `FK__Recetas__idProdu__4222D4EF`
    FOREIGN KEY (`idSaleProduct`)
    REFERENCES `Restaurant`.`SaleProducts` (`idSaleProduct`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `FK__Recetas__idProdu__4316F928`
    FOREIGN KEY (`idPurchaseProduct`)
    REFERENCES `Restaurant`.`PurchaseProducts` (`idPurchaseProduct`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);
SET FOREIGN_KEY_CHECKS = 1;