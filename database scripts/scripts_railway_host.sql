-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema railway
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema railway
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `railway` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `railway` ;

-- -----------------------------------------------------
-- Table `railway`.`curso`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `railway`.`curso` (
  `idcurso` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(60) NOT NULL,
  PRIMARY KEY (`idcurso`))
ENGINE = InnoDB
AUTO_INCREMENT = 14
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `railway`.`grupo`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `railway`.`grupo` (
  `idgrupo` INT NOT NULL AUTO_INCREMENT,
  `numero` INT NOT NULL,
  `horario` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`idgrupo`))
ENGINE = InnoDB
AUTO_INCREMENT = 27
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `railway`.`grupoxcurso`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `railway`.`grupoxcurso` (
  `idgrupoXcurso` INT NOT NULL AUTO_INCREMENT,
  `idgrupo` INT NOT NULL,
  `idcurso` INT NOT NULL,
  `fechaInicio` DATE NOT NULL,
  `fechaFinal` DATE NOT NULL,
  `profesor` VARCHAR(200) NOT NULL,
  `horario` VARCHAR(45) NOT NULL,
  `jornada` VARCHAR(45) NOT NULL DEFAULT 'Diurno',
  PRIMARY KEY (`idgrupoXcurso`),
  INDEX `fk_grupoXcurso_grupo1_idx` (`idgrupo` ASC) VISIBLE,
  INDEX `fk_grupoXcurso_curso1_idx` (`idcurso` ASC) VISIBLE,
  CONSTRAINT `fk_grupoXcurso_curso1`
    FOREIGN KEY (`idcurso`)
    REFERENCES `railway`.`curso` (`idcurso`),
  CONSTRAINT `fk_grupoXcurso_grupo1`
    FOREIGN KEY (`idgrupo`)
    REFERENCES `railway`.`grupo` (`idgrupo`))
ENGINE = InnoDB
AUTO_INCREMENT = 44
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `railway`.`fusion`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `railway`.`fusion` (
  `idfusion` INT NOT NULL AUTO_INCREMENT,
  `idgrupoXcurso1` INT NOT NULL,
  `idgrupoXcurso2` INT NOT NULL,
  PRIMARY KEY (`idfusion`),
  INDEX `fk_fusion_grupoxcurso1_idx` (`idgrupoXcurso1` ASC) VISIBLE,
  INDEX `fk_fusion_grupoxcurso2_idx` (`idgrupoXcurso2` ASC) VISIBLE,
  CONSTRAINT `fk_fusion_grupoxcurso1`
    FOREIGN KEY (`idgrupoXcurso1`)
    REFERENCES `railway`.`grupoxcurso` (`idgrupoXcurso`),
  CONSTRAINT `fk_fusion_grupoxcurso2`
    FOREIGN KEY (`idgrupoXcurso2`)
    REFERENCES `railway`.`grupoxcurso` (`idgrupoXcurso`))
ENGINE = InnoDB
AUTO_INCREMENT = 11
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `railway`.`usuario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `railway`.`usuario` (
  `idusuario` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(45) NOT NULL,
  `apellidos` VARCHAR(200) NOT NULL,
  `correo` VARCHAR(80) NOT NULL,
  `contraseña` VARCHAR(45) NOT NULL,
  `admin` BIT(1) NOT NULL DEFAULT b'0',
  PRIMARY KEY (`idusuario`))
ENGINE = InnoDB
AUTO_INCREMENT = 15
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

USE `railway` ;
-- -----------------------------------------------------
-- procedure GetCursos
-- -----------------------------------------------------

DELIMITER $$
USE `railway`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetCursos`()
BEGIN
    SELECT nombre FROM curso;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure GetCursosEnGrupo
-- -----------------------------------------------------

DELIMITER $$
USE `railway`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetCursosEnGrupo`(p_idGrupo INT)
BEGIN
	-- Obtengo la información de los cursos para ese grupo, si está disponible
	SELECT 
		COALESCE(curso.nombre) AS nombre_curso,
        (curso.idcurso) AS idCurso,
		IFNULL(grupoxcurso.fechaInicio, '') AS fechaInicio,
		IFNULL(grupoxcurso.fechaFinal, '') AS fechaFinal,
		IFNULL(grupoxcurso.horario, '') AS horario,
		IFNULL(grupoxcurso.profesor, '') AS profesor
	FROM curso 
	INNER JOIN grupoxcurso ON curso.idcurso = grupoxcurso.idcurso AND grupoxcurso.idgrupo = p_idGrupo;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure GetCursosxGrupo
-- -----------------------------------------------------

DELIMITER $$
USE `railway`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetCursosxGrupo`(p_idGrupo INT)
BEGIN
	-- Obtengo la información de los cursos para ese grupo, si está disponible
	SELECT 
		COALESCE(curso.nombre) AS nombre_curso,
        (curso.idcurso) AS idCurso,
		IFNULL(grupoxcurso.fechaInicio, '') AS fechaInicio,
		IFNULL(grupoxcurso.fechaFinal, '') AS fechaFinal,
		IFNULL(grupoxcurso.horario, '') AS horario,
		IFNULL(grupoxcurso.profesor, '') AS profesor
	FROM curso 
	LEFT JOIN grupoxcurso ON curso.idcurso = grupoxcurso.idcurso AND grupoxcurso.idgrupo = p_idGrupo;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure VerificarDistanciaCursos
-- -----------------------------------------------------

DELIMITER $$
USE `railway`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `VerificarDistanciaCursos`(
    IN p_nombreCurso VARCHAR(60),
    IN p_fechaInicio DATE,
    IN p_fechaFinal DATE
)
BEGIN
    DECLARE cursoExistente INT;
    DECLARE fechaFinalExistente DATE;
    DECLARE cumpleDistancia BOOLEAN;
    DECLARE mesesDiferencia INT; -- Declaración de la variable mesesDiferencia

    -- Verificar si ya hay un curso del mismo tipo registrado
    -- Cuenta cuántos grupos tienen el curso "x"
    SELECT COUNT(idgrupo) INTO cursoExistente
    FROM grupoxcurso
    WHERE idcurso = (SELECT idcurso FROM curso WHERE nombre = p_nombreCurso);
    -- select cursoExistente; -- Nuevo fixing bug

    -- Si ningún curso lo ha registrado, entonces no hay restricciones
    IF cursoExistente = 0 THEN
        SET cumpleDistancia = TRUE;
    ELSE
        -- Obtener la fecha de finalización del curso existente más reciente
        SELECT MAX(fechaFinal) INTO fechaFinalExistente
        FROM grupoxcurso
        WHERE idcurso = (SELECT idcurso FROM curso WHERE nombre = p_nombreCurso);
        -- select fechaFinalExistente; -- Nuevo fixing bug

        -- Calcular la diferencia en meses entre las fechas
        SET mesesDiferencia = TIMESTAMPDIFF(MONTH, fechaFinalExistente, p_fechaInicio);
         -- select mesesDiferencia; -- Nuevo fixing bug
        -- Verificar si la distancia entre cursos es de al menos dos meses
        IF mesesDiferencia >= 2 THEN
            SET cumpleDistancia = TRUE;
        ELSE
            SET cumpleDistancia = FALSE;
        END IF;
    END IF;

    -- Devolver el resultado
    select cumpleDistancia;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure VerificarDistanciaUnaSemana
-- -----------------------------------------------------

DELIMITER $$
USE `railway`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `VerificarDistanciaUnaSemana`(
    IN p_idGrupo INT,
    IN p_fechaInicio DATE
)
BEGIN
    DECLARE ultimaFechaFinal DATE;
    DECLARE cumpleDistancia BOOLEAN;

    -- Obtener la fecha final del último curso agregado para el grupo
    SELECT MAX(fechaFinal) INTO ultimaFechaFinal 
    FROM grupoxcurso 
    WHERE idgrupo = p_idGrupo;
    
    IF ultimaFechaFinal != null THEN
		-- Verificar la distancia de una semana entre la fecha de inicio del nuevo curso y la fecha final del último curso
		IF DATEDIFF(p_fechaInicio, ultimaFechaFinal) >= 7 THEN
			-- Si la distancia es de al menos una semana, se cumple la restricción
			SET cumpleDistancia = TRUE;
		ELSE
			-- Si la distancia no es de al menos una semana, no se cumple la restricción
			SET cumpleDistancia = FALSE;
		END IF;
	ELSE 
		-- Si no hay cursos registrados para ese grupo, no hay nada que validar
		SET cumpleDistancia = TRUE;
    END IF;

    -- Devolver el resultado
    SELECT cumpleDistancia;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure getGrupos
-- -----------------------------------------------------

DELIMITER $$
USE `railway`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `getGrupos`()
BEGIN
    SELECT idgrupo, numero, horario FROM grupo;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure getHorarioGrupo
-- -----------------------------------------------------

DELIMITER $$
USE `railway`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `getHorarioGrupo`(p_idGrupo int)
BEGIN
    SELECT horario FROM grupo WHERE idgrupo = p_idGrupo;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure intercambiarCursos
-- -----------------------------------------------------

DELIMITER $$
USE `railway`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `intercambiarCursos`(
	IN p_idGrupo INT,
    IN p_idCurso1 INT,
    IN p_idCurso2 INT
)
BEGIN
	DECLARE fechaInicioCurso1 DATE;
    DECLARE fechaFinalCurso1 DATE;
    
    DECLARE fechaInicioCurso2 DATE;
    DECLARE fechaFinalCurso2 DATE;
    
    SELECT fechaInicio, fechaFinal INTO fechaInicioCurso1, fechaFinalCurso1
    FROM grupoxcurso
    WHERE idgrupo = p_idGrupo AND idcurso = p_idCurso1;
    
    SELECT fechaInicio, fechaFinal INTO fechaInicioCurso2, fechaFinalCurso2
    FROM grupoxcurso
    WHERE idgrupo = p_idGrupo AND idcurso = p_idCurso2;
    
	UPDATE grupoxcurso SET 
		fechaInicio = fechaInicioCurso2,
		fechaFinal = fechaFinalCurso2
    WHERE idgrupo = p_idGrupo AND idcurso = p_idCurso1;
    
    UPDATE grupoxcurso SET 
		fechaInicio = fechaInicioCurso1,
		fechaFinal = fechaFinalCurso1
    WHERE idgrupo = p_idGrupo AND idcurso = p_idCurso2;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure updateCursoGrupo
-- -----------------------------------------------------
DELIMITER $$
USE `railway`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `updateCursoGrupo`(
    IN p_idGrupo INT,
    IN p_idCurso INT,
    IN p_fechaInicio VARCHAR(20),
    IN p_fechaFinal varchar(20),
    IN p_profesor VARCHAR(200),
    IN p_horario VARCHAR(45)
)
BEGIN
    DECLARE curso_existente INT;
    -- DECLARE fechaInicioDate DATE;
    -- DECLARE fechaFinalDate DATE;

    -- Convertir las cadenas de fecha en objetos de fecha
    -- SET fechaInicioDate = STR_TO_DATE(p_fechaInicio, '%Y-%m-%d');
    -- SET fechaFinalDate = STR_TO_DATE(p_fechaFinal, '%Y-%m-%d');
    -- VERIFICAR SI EXISTE EL CURSO PARA ESE GRUPO
    SELECT COUNT(*) INTO curso_existente 
    FROM grupoxcurso 
    WHERE idgrupo = p_idGrupo AND idcurso = p_idCurso;

    IF curso_existente > 0 THEN
        -- Si el curso existe para ese grupo, se ACTUALIZAN los datos
        UPDATE grupoxcurso SET
            -- fechaInicio = IF(fechaInicioDate IS NOT NULL AND fechaInicioDate <> '', fechaInicioDate, fechaInicio),
            -- fechaFinal = IF(fechaFinalDate IS NOT NULL AND fechaFinalDate <> '', fechaFinalDate, fechaFinal),
            fechaInicio = IF(p_fechaInicio IS NOT NULL AND p_fechaInicio <> '', p_fechaInicio, fechaInicio),
            fechaFinal = IF(p_fechaFinal IS NOT NULL AND p_fechaFinal <> '', p_fechaFinal, fechaFinal),
            profesor = IF(p_profesor IS NOT NULL AND p_profesor <> '', p_profesor, profesor),
            horario = IF(p_horario IS NOT NULL AND p_horario <> '', p_horario, horario)
        WHERE idgrupo = p_idGrupo AND idcurso = p_idCurso;
    ELSE
        -- Si el curso NO existe para ese grupo, se CREA un nuevo registro
        INSERT INTO grupoxcurso (idgrupo, idcurso, fechaInicio, fechaFinal, profesor, horario)
        VALUES (p_idGrupo, p_idCurso, p_fechaInicio, p_fechaFinal, p_profesor, p_horario);
    END IF;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure updateCursoGrupo1
-- -----------------------------------------------------
DELIMITER $$
USE `railway`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `updateCursoGrupo1`(
    IN p_idGrupo INT,
    IN p_idCurso INT,
    IN p_fechaInicio VARCHAR(20),
    IN p_fechaFinal varchar(20),
    IN p_profesor VARCHAR(200),
    IN p_horario VARCHAR(45),
    IN p_jornada VARCHAR(45)
)
BEGIN
    DECLARE curso_existente INT;
    -- DECLARE fechaInicioDate DATE;
    -- DECLARE fechaFinalDate DATE;

    -- Convertir las cadenas de fecha en objetos de fecha
    -- SET fechaInicioDate = STR_TO_DATE(p_fechaInicio, '%Y-%m-%d');
    -- SET fechaFinalDate = STR_TO_DATE(p_fechaFinal, '%Y-%m-%d');
    -- VERIFICAR SI EXISTE EL CURSO PARA ESE GRUPO
    SELECT COUNT(*) INTO curso_existente 
    FROM grupoxcurso 
    WHERE idgrupo = p_idGrupo AND idcurso = p_idCurso;

    IF curso_existente > 0 THEN
        -- Si el curso existe para ese grupo, se ACTUALIZAN los datos
        UPDATE grupoxcurso SET
            -- fechaInicio = IF(fechaInicioDate IS NOT NULL AND fechaInicioDate <> '', fechaInicioDate, fechaInicio),
            -- fechaFinal = IF(fechaFinalDate IS NOT NULL AND fechaFinalDate <> '', fechaFinalDate, fechaFinal),
            fechaInicio = IF(p_fechaInicio IS NOT NULL AND p_fechaInicio <> '', p_fechaInicio, fechaInicio),
            fechaFinal = IF(p_fechaFinal IS NOT NULL AND p_fechaFinal <> '', p_fechaFinal, fechaFinal),
            profesor = IF(p_profesor IS NOT NULL AND p_profesor <> '', p_profesor, profesor),
            horario = IF(p_horario IS NOT NULL AND p_horario <> '', p_horario, horario),
            jornada = IF(p_jornada IS NOT NULL AND p_jornada <> '', p_jornada, jornada)
        WHERE idgrupo = p_idGrupo AND idcurso = p_idCurso;
    ELSE
        -- Si el curso NO existe para ese grupo, se CREA un nuevo registro
        INSERT INTO grupoxcurso (idgrupo, idcurso, fechaInicio, fechaFinal, profesor, horario, jornada)
        VALUES (p_idGrupo, p_idCurso, p_fechaInicio, p_fechaFinal, p_profesor, p_horario, p_jornada);
    END IF;
END$$

DELIMITER ;



SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;


select * from grupoxcurso