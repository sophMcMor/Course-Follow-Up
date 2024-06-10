-- STORED PROCEDURES

DELIMITER //

-- Permite actualizar la información de un curso para un grupo específico, SI NO EXISTE, crea un nuevo registro
CREATE PROCEDURE updateCursoGrupo (
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
    WHERE idGrupo = p_idGrupo AND idcurso = p_idCurso;

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
        WHERE idGrupo = p_idGrupo AND idcurso = p_idCurso;
    ELSE
        -- Si el curso NO existe para ese grupo, se CREA un nuevo registro
        INSERT INTO grupoxcurso (idGrupo, idcurso, fechaInicio, fechaFinal, profesor, horario,jornada)
        VALUES (p_idGrupo, p_idCurso, p_fechaInicio, p_fechaFinal, p_profesor, p_horario,p_jornada);
    END IF;
END //

CREATE PROCEDURE getGrupos ()
BEGIN
    SELECT idgrupo, numero, horario FROM grupo;
END //

CREATE PROCEDURE getHorarioGrupo (p_idGrupo int)
BEGIN
    SELECT horario FROM grupo WHERE idGrupo = p_idGrupo;
END //

CREATE PROCEDURE GetCursos ()
BEGIN
    SELECT nombre FROM Curso;
END //

CREATE PROCEDURE GetCursosxGrupo(p_idGrupo INT)
BEGIN
	-- Obtengo la información de los cursos para ese grupo, si está disponible
	SELECT
		
		COALESCE(curso.nombre) AS nombre_curso,
        (curso.idcurso) AS idCurso,
		IFNULL(grupoxcurso.fechaInicio, '') AS fechaInicio,
		IFNULL(grupoxcurso.fechaFinal, '') AS fechaFinal,
		IFNULL(grupoxcurso.horario, '') AS horario,
		IFNULL(grupoxcurso.profesor, '') AS profesor
	FROM Curso 
	LEFT JOIN GrupoxCurso ON curso.idCurso = grupoxcurso.idCurso AND grupoxcurso.idGrupo = p_idGrupo;
END //


-- Este procedimiento revisa que entre cursos de UN MISMO GRUPO haya distancia de 1 semana
CREATE PROCEDURE VerificarDistanciaUnaSemana(
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
END;//


-- Este procedimiento revisa que entre cursos del MISMO TIPO haya distancia de 2 MESES
-- Si se dio el "Curso A" en Mayo para el "Grupo 40", para cualquier otro grupo el "Curso A" debe darse hasta Agosto
CREATE PROCEDURE VerificarDistanciaCursos(
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
END//

DELIMITER ;

CREATE PROCEDURE intercambiarCursos(
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
END

CREATE PROCEDURE `GetCursosEnGrupo` (p_idGrupo INT)
BEGIN
	-- Obtengo la información de los cursos para ese grupo, si está disponible
	SELECT 
		COALESCE(curso.nombre) AS nombre_curso,
        (curso.idcurso) AS idCurso,
		IFNULL(grupoxcurso.fechaInicio, '') AS fechaInicio,
		IFNULL(grupoxcurso.fechaFinal, '') AS fechaFinal,
		IFNULL(grupoxcurso.horario, '') AS horario,
		IFNULL(grupoxcurso.profesor, '') AS profesor
	FROM Curso 
	INNER JOIN GrupoxCurso ON curso.idCurso = grupoxcurso.idCurso AND grupoxcurso.idGrupo = p_idGrupo;
END
	
select * from usuario
 -- CALL GetCursosxGrupo(1)
 -- CALL getHorarioGrupo(2) 
 -- call VerificarDistanciaCursos("Introducción a la Logística",'2024-05-07','2024-06-11')
 -- select * from grupoxcurso 

call VerificarDistanciaUnaSemana(1, '2024-05-07')
