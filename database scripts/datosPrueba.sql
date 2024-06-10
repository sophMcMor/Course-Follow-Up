use coursefollowup;
-- TABLA USUARIOS
INSERT INTO usuario (nombre, apellidos, correo, contraseña, admin) 
VALUES ('Sophya', 'Mc Lean', 'sophyafernanda@gmail.com', '123456', 0);

-- TABLA CURSOS
INSERT INTO Curso (nombre) VALUES ('Introducción a la Logística');
INSERT INTO Curso (nombre) VALUES ('Administración de Bodegas e Inventarios I');
INSERT INTO Curso (nombre) VALUES ('Administración de Transporte');
INSERT INTO Curso (nombre) VALUES ('Administración de Bodegas e Inventarios II');
INSERT INTO Curso (nombre) VALUES ('Infraestructura de Almacenes');
INSERT INTO Curso (nombre) VALUES ('Matemática');
INSERT INTO Curso (nombre) VALUES ('Costos Logísticos');
INSERT INTO Curso (nombre) VALUES ('Estadística');
INSERT INTO Curso (nombre) VALUES ('Planificación de la Producción y de Servicios');
INSERT INTO Curso (nombre) VALUES ('Comunicación');
INSERT INTO Curso (nombre) VALUES ('Administración de Abastecimiento y Compras');
INSERT INTO Curso (nombre) VALUES ('Inventarios y Modelos de Pronósticos');
INSERT INTO Curso (nombre) VALUES ('Proyecto de Graduación');

-- GRUPOS
INSERT INTO Grupo (numero, horario) VALUES (1, 'Lunes y Miércoles');
INSERT INTO Grupo (numero, horario) VALUES (2, 'Martes y Jueves');
INSERT INTO Grupo (numero, horario) VALUES (3, 'Lunes y Miércoles');
INSERT INTO Grupo (numero, horario) VALUES (4, 'Martes y Jueves');
INSERT INTO Grupo (numero, horario) VALUES (5, 'Lunes y Miércoles');
INSERT INTO Grupo (numero, horario) VALUES (10, 'Lunes y Miércoles');

-- GRUPOXCURSO
INSERT INTO GrupoxCurso (idgrupo, idcurso, fechaInicio, fechaFinal, profesor, horario) 
VALUES (1, 1, '2024-04-01', '2024-06-30', 'Juan Rivera', 'Lunes y Miércoles');
INSERT INTO GrupoxCurso (idgrupo, idcurso, fechaInicio, fechaFinal, profesor, horario) 
VALUES (2, 2, '2024-04-02', '2024-07-01', 'Mario Fallas', 'Martes y Jueves');
INSERT INTO GrupoxCurso (idgrupo, idcurso, fechaInicio, fechaFinal, profesor, horario) 
VALUES (3, 3, '2024-04-03', '2024-07-02', 'Lucía Hernández', 'Lunes y Miércoles');


-- Obtener los cursos para ese grupo
SELECT curso.nombre, fechaInicio, fechaFinal, profesor, horario 
FROM GrupoxCurso 
INNER JOIN Curso ON Curso.idCurso = GrupoxCurso.idCurso 
WHERE GrupoxCurso.idGrupo = 1;



