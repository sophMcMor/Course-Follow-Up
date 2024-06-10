-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema coursefollowup
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema coursefollowup
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `coursefollowup` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `coursefollowup` ;

-- -----------------------------------------------------
-- Table `coursefollowup`.`usuario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `coursefollowup`.`usuario` (
  `idusuario` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(45) NOT NULL,
  `apellidos` VARCHAR(200) NOT NULL,
  `correo` VARCHAR(80) NOT NULL,
  `contraseña` VARCHAR(45) NOT NULL,
  `admin` BIT(1) NOT NULL DEFAULT b'0',
  PRIMARY KEY (`idusuario`))
ENGINE = InnoDB
AUTO_INCREMENT = 10
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `coursefollowup`.`planificador`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `coursefollowup`.`planificador` (
  `idplanificador` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(45) NOT NULL,
  `fechaInicio` DATE NOT NULL,
  `fechaFinal` DATE NOT NULL,
  PRIMARY KEY (`idplanificador`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `coursefollowup`.`grupo`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `coursefollowup`.`grupo` (
  `idgrupo` INT NOT NULL AUTO_INCREMENT,
  `numero` INT NOT NULL,
  `horario` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`idgrupo`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `coursefollowup`.`planificadorXgrupo`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `coursefollowup`.`planificadorXgrupo` (
  `idplanificadorXgrupo` INT NOT NULL AUTO_INCREMENT,
  `idplanificador` INT NOT NULL,
  `idgrupo` INT NOT NULL,
  PRIMARY KEY (`idplanificadorXgrupo`, `idplanificador`, `idgrupo`),
  INDEX `fk_planificadorXgrupo_planificador_idx` (`idplanificador` ASC) VISIBLE,
  INDEX `fk_planificadorXgrupo_grupo1_idx` (`idgrupo` ASC) VISIBLE,
  CONSTRAINT `fk_planificadorXgrupo_planificador`
    FOREIGN KEY (`idplanificador`)
    REFERENCES `coursefollowup`.`planificador` (`idplanificador`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_planificadorXgrupo_grupo1`
    FOREIGN KEY (`idgrupo`)
    REFERENCES `coursefollowup`.`grupo` (`idgrupo`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `coursefollowup`.`curso`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `coursefollowup`.`curso` (
  `idcurso` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(60) NOT NULL,
  PRIMARY KEY (`idcurso`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `coursefollowup`.`grupoXcurso`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `coursefollowup`.`grupoXcurso` (
  `idgrupoXcurso` INT NOT NULL AUTO_INCREMENT,
  `idgrupo` INT NOT NULL,
  `idcurso` INT NOT NULL,
  `fechaInicio` DATE NOT NULL,
  `fechaFinal` DATE NOT NULL,
  `profesor` VARCHAR(200) NOT NULL,
  `horario` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`idgrupoXcurso`, `idgrupo`, `idcurso`),
  INDEX `fk_grupoXcurso_grupo1_idx` (`idgrupo` ASC) VISIBLE,
  INDEX `fk_grupoXcurso_curso1_idx` (`idcurso` ASC) VISIBLE,
  CONSTRAINT `fk_grupoXcurso_grupo1`
    FOREIGN KEY (`idgrupo`)
    REFERENCES `coursefollowup`.`grupo` (`idgrupo`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_grupoXcurso_curso1`
    FOREIGN KEY (`idcurso`)
    REFERENCES `coursefollowup`.`curso` (`idcurso`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
