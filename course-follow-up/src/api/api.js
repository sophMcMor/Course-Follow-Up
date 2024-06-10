const express = require('express');
const cors = require('cors');
const CryptoJS = require('crypto-js');
const db = require('./db');
const app = express();
const port = 3001;

const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());
app.use(bodyParser.json());

// Importa la biblioteca dotenv
require('dotenv').config({ path: './claves_en_des.env' });

// Accede a la clave desde las variables de entorno
const claveAleatoria = process.env.CLAVE_ALEATORIA;
const correoMap = {}; // Diccionario para la gestión de correos

// Ahora puedes utilizar la clave en tu aplicación
console.log('Clave aleatoria:', claveAleatoria);


// Función para encriptar datos
function encryptData(data) {
  return CryptoJS.AES.encrypt(data, claveAleatoria).toString();
}

// Función para desencriptar datos
function decryptData(ciphertext) {
  const bytes = CryptoJS.AES.decrypt(ciphertext, claveAleatoria);
  return bytes.toString(CryptoJS.enc.Utf8);
}

// Define la función que utiliza await dentro de una función asíncrona
async function obtenerUsuarios() {
  try {
      const [usuarios] = await db.query("SELECT * FROM railway.usuario");

      // Llenar el diccionario con los correos electrónicos desencriptados y encriptados
      usuarios.forEach(usuario => {
        const correoDesencriptado = decryptData(usuario.correo)
        correoMap[correoDesencriptado] = usuario.correo;
      });
      
      console.log("MAPEO", correoMap);
  } catch (error) {
      console.error('Error al obtener usuarios:', error);  
  }
}

// Llama a la función asíncrona
obtenerUsuarios();

// -------------------------------------------- FUNCIONALIDADES DE CRUD BD --------------------------------------------------------------

// Ruta para obtener todos los usuarios
app.get('/usuarios', async(req, res) =>{
    try{  
      // Obtener usuarios de la base de datos
      const [usuarios] = await db.query("SELECT * FROM railway.usuario");
      
      const usuariosDesencriptados = usuarios.map(usuario => ({
        idusuario: usuario.idusuario,
        nombre: usuario.nombre,
        apellidos: usuario.apellidos,
        correo: decryptData(usuario.correo),
        contraseña: decryptData(usuario.contraseña),
        admin: usuario.admin
      }));

      console.log("Lista de Usuarios", usuariosDesencriptados);

      res.json(usuariosDesencriptados);
    } catch(error){
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
});

// Ruta para obtener un usuario por ID
app.get('/usuario/:idUsuario', async(req, res) => {
  const { idUsuario } = req.params;
  try {
      // Obtener el usuario de la base de datos
      const [usuarios] = await db.query("SELECT * FROM railway.usuario WHERE idusuario = ?", [idUsuario]);
      
      if (usuarios.length === 0) {
          return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      const usuario = usuarios[0];
      const usuarioDesencriptado = {
          idusuario: usuario.idusuario,
          nombre: usuario.nombre,
          apellidos: usuario.apellidos,
          correo: decryptData(usuario.correo),
          contraseña: decryptData(usuario.contraseña),
          admin: usuario.admin
      };

      console.log("Usuario encontrado", usuarioDesencriptado);

      res.json(usuarioDesencriptado);
  } catch(error) {
      console.error('Error al obtener usuario:', error);
      res.status(500).json({ error: 'Error al obtener usuario' });
  }
});

// Ruta para agregar un nuevo usuario
app.post('/usuarios', async (req, res) => {
    try {
      const { name, lastName, correo, psswrd } = req.body;

      // Encriptar los datos sensibles antes de almacenarlos en la base de datos
      const correoEncriptado = encryptData(correo); 
      const psswrdEncriptado = encryptData(psswrd);
             
      // Agregar usuario a la base de datos
      const result = await db.query("INSERT INTO railway.usuario (nombre, apellidos, correo, contraseña) VALUES (?, ?, ?, ?)", [name, lastName, correoEncriptado, psswrdEncriptado]);
  
      // Actualizar el diccionario correoMap con el nuevo usuario registrado
      correoMap[correo] = correoEncriptado;

      res.status(201).json({ mensaje: 'Usuario agregado correctamente', resultado: result });
    } catch (error) {
      console.error('Error al agregar usuario:', error);
      res.status(500).json({ error: 'Error al agregar usuario' });
    }
  });

// Ruta para actualizar un usuario --> Editar Cuenta
app.put('/usuario/:idUsuario', async (req, res) => {
  const { idUsuario } = req.params;
  const { correo, contraseña } = req.body;

  // Encriptar los datos sensibles antes de almacenarlos en la base de datos
  const correoEncriptado = encryptData(correo); 
  const psswrdEncriptado = encryptData(contraseña);

  try {
      const query = 'UPDATE railway.usuario SET correo = ?, contraseña = ? WHERE idusuario = ?';
      const [results] = await db.query(query, [correoEncriptado, psswrdEncriptado, idUsuario]);

      if (results.affectedRows === 0) {
          res.status(404).send('Usuario no encontrado');
      } else {
          res.send('Usuario actualizado correctamente');
      }
  } catch (error) {
      console.error('Error al actualizar usuario:', error);
      res.status(500).send('Error al actualizar usuario');
  }
});

// Ruta para actualizar un usuario --> Editar Cuenta
app.put('/editarUsuario/:idUsuario', async (req, res) => {
  const { idUsuario } = req.params;
  const { admin } = req.body;


  try {
      const query = 'UPDATE railway.usuario SET admin = ? WHERE idusuario = ?';
      const [results] = await db.query(query, [admin, idUsuario]);

      if (results.affectedRows === 0) {
          res.status(404).send('Usuario no encontrado');
      } else {
          res.send('Usuario actualizado correctamente');
      }
  } catch (error) {
      console.error('Error al actualizar usuario:', error);
      res.status(500).send('Error al actualizar usuario');
  }
});


//Ruta para obtener todos los grupos
app.get('/grupos', async(req, res) =>{
  try{
      const [grupos] = await db.query("SELECT * FROM railway.grupo");
      res.json(grupos);
  } catch(error){
      console.error('Error al obtener grupos:', error);
      res.status(500).json({ error: 'Error al obtener grupos' });
  }
});

// Ruta para agregar un nuevo grupo
app.post('/grupos', async (req, res) => {
  try {
      const { numero, horario } = req.body;
      
      // Insertar el nuevo grupo en la base de datos
      const result = await db.query("INSERT INTO railway.grupo (numero, horario) VALUES (?, ?)", [numero, horario]);
      
      // Obtener el ID del grupo insertado
      const idGrupoResult = await db.query("SELECT LAST_INSERT_ID() AS idGrupo");
      // idGrupo = idGrupoResult[0].idGrupo;

      // Devolver el ID del grupo insertado
      res.status(201).json({ mensaje: 'Grupo agregado correctamente', idGrupoResult });
  } catch (error) {
      console.error('Error al agregar grupo:', error);
      res.status(500).json({ error: 'Error al agregar grupo' });
  }
});

// Ruta para obtner los cursos por idGrupo
app.get('/cursos/:idGrupo', async(req, res) =>{
  const idGrupo = req.params.idGrupo;
  try{
      const [cursos] = await db.query("CALL GetCursosxGrupo(?)", [idGrupo]);
      res.json(cursos);

  } catch(error){
      console.error('Error al obtener cursos:', error);
      res.status(500).json({ error: 'Error al obtener cursos' });
  }
});

// Ruta para obtner los cursos por idGrupo
app.get('/cursosAgregados/:idGrupo', async(req, res) =>{
  const idGrupo = req.params.idGrupo;
  try{
      const [cursos] = await db.query("CALL GetCursosEnGrupo(?)", [idGrupo]);
      res.json(cursos);

  } catch(error){
      console.error('Error al obtener cursos:', error);
      res.status(500).json({ error: 'Error al obtener cursos' });
  }
});

// Ruta para agregar un nuevo curso a un grupo
app.post('/actualizarCursos', async (req, res) => {
  try {
      const { idGrupo, idCurso, fechaInicio, fechaFinal, profesor, horario,jornada } = req.body;

      if(horario === "K-J"){
        nuevoHorario = "Martes y Jueves";
      }

      if(horario === "L-M"){
        nuevoHorario = "Lunes y Miércoles";
      }

      const formatoEsperado = /^\d{4}-\d{2}-\d{2}$/;
      if(!formatoEsperado.test(fechaInicio)){
        console.log("formatear fecha inicio")
        const fechaInicioFormateada = fechaInicio.split('-').reverse().join('-'); // Convertir a "YYYY-MM-DD"
      }
      if(!formatoEsperado.test(fechaFinal)){
        console.log("formatear fecha final")
        const fechaFinalFormateada = fechaFinal.split('-').reverse().join('-');// Convertir a "YYYY-MM-DD"
      }

      const result = await db.query("CALL updateCursoGrupo1(?,?,?,?,?,?,?)", [idGrupo, idCurso, fechaInicio, fechaFinal, profesor, nuevoHorario,jornada]);
    res.status(201).json({ mensaje: 'Curso actualizado correctamente', resultado: result });
  } catch (error) {
    console.error('Error al actualizar curso:', error);
    res.status(500).json({ error: 'Error al agregar curso' });
  }
});

// Ruta para intercambiar cursos de un grupo
app.put('/intercambiarCursos', async (req, res) => {
  try {
      const { idGrupo, idCurso1, idCurso2} = req.body;
      console.log("ID GRUPO que va a la BD: ", idGrupo);
      console.log("ID CURSO_1 que va a la BD: ", idCurso1);
      console.log("ID CURSO_2 que va a la BD: ", idCurso2);

      const result = await db.query("CALL intercambiarCursos(?,?,?)", [idGrupo, idCurso1, idCurso2]);
      res.status(201).json({ mensaje: 'Curso actualizado correctamente', resultado: result });
  } catch (error) {
    console.error('Error al intercambiar los cursos:', error);
    res.status(500).json({ error: 'Error al intercambiar los cursos' });
  }
});

/*
// Ruta para obtener cursos filtrados por fecha
app.get('/cursosXFecha', async (req, res) => {
  try {
    const { fechaInicio, fechaFinal } = req.query;

    const [cursos] = await db.query(`
      SELECT g.numero AS grupoNumero, g.horario AS grupoHorario, c.idcurso, c.nombre AS cursoNombre, gxc.fechaInicio, gxc.fechaFinal, gxc.profesor, gxc.horario AS cursoHorario
      FROM grupoxcurso gxc
      JOIN grupo g ON gxc.idgrupo = g.idgrupo
      JOIN curso c ON gxc.idcurso = c.idcurso
      WHERE gxc.fechaInicio >= ? AND gxc.fechaFinal <= ?
    `, [fechaInicio, fechaFinal]);

    res.json(cursos);
  } catch (error) {
    console.error('Error al obtener cursos por fecha:', error);
    res.status(500).json({ error: 'Error al obtener cursos por fecha' });
  }
});*/

// Ruta para obtener cursos filtrados por fecha
app.get('/cursosXFecha', async (req, res) => {
  try {
    const { fechaInicio, fechaFinal } = req.query;

    const [cursos] = await db.query(`
      SELECT gxc.idgrupoXcurso, g.idgrupo ,g.numero AS grupoNumero, g.horario AS grupoHorario, c.idcurso, c.nombre AS cursoNombre, gxc.fechaInicio, gxc.fechaFinal, gxc.profesor, gxc.horario AS cursoHorario, gxc.jornada as jornada
      FROM grupoxcurso gxc
      JOIN grupo g ON gxc.idgrupo = g.idgrupo
      JOIN curso c ON gxc.idcurso = c.idcurso
      WHERE gxc.fechaInicio >= ? AND gxc.fechaFinal <= ?
    `, [fechaInicio, fechaFinal]);

    res.json(cursos);
  } catch (error) {
    console.error('Error al obtener cursos por fecha:', error);
    res.status(500).json({ error: 'Error al obtener cursos por fecha' });
  }
});


// Ruta para obtener grupos filtrados por fecha
// Para la tabla de grupos a fusionar
app.get('/gruposXFecha', async (req, res) => {
  try {
    const { fechaInicio, fechaFinal, grupo_id, idcurso } = req.query;
    console.log('REVISAR AQUI 333: ', idcurso);
    const [cursos] = await db.query(`
      SELECT gxc.idgrupoXcurso ,g.numero AS grupoNumero
      FROM grupoxcurso gxc
      JOIN grupo g ON gxc.idgrupo = g.idgrupo
      WHERE gxc.fechaInicio >= ? AND gxc.fechaFinal <= ? AND gxc.idgrupo != ? AND gxc.idcurso = ?
    `, [fechaInicio, fechaFinal, grupo_id, idcurso]);

    res.json(cursos);
  } catch (error) {
    console.error('Error al obtener cursos por fecha:', error);
    res.status(500).json({ error: 'Error al obtener cursos por fecha' });
  }
});


//Ruta para obtener todos los fusiones
app.get('/fusiones', async(req, res) =>{
  try{
      const [fusiones] = await db.query(`SELECT f.*, g1.numero AS numero_grupo_1, g2.numero AS numero_grupo_2
      FROM fusion f
      JOIN grupoxcurso gc1 ON f.idgrupoXcurso1 = gc1.idgrupoXcurso
      JOIN grupoxcurso gc2 ON f.idgrupoXcurso2 = gc2.idgrupoXcurso
      JOIN grupo g1 ON gc1.idgrupo = g1.idgrupo
      JOIN grupo g2 ON gc2.idgrupo = g2.idgrupo;`);
      res.json(fusiones);
  } catch(error){
      console.error('Error al obtener fusiones:', error);
      res.status(500).json({ error: 'Error al obtener fusiones' });
  }
});

// Ruta para agregar una nueva fusión
app.post('/fusion', async (req, res) => {
  try {
      const { idgrupoXcurso1, idgrupoXcurso } = req.body;
      
      // Insertar el nuevo fusion en la base de datos
      const result = await db.query("INSERT INTO railway.fusion (idgrupoXcurso1, idgrupoXcurso2) VALUES (?, ?)", [idgrupoXcurso1, idgrupoXcurso]);
      
      // Obtener el ID de la fusion insertada
      const idFusionResult = await db.query("SELECT LAST_INSERT_ID() AS idfusion");

      // Devolver el ID de la fusion insertado
      res.status(201).json({ mensaje: 'Fusion agregado correctamente', idFusionResult });
  } catch (error) {
      console.error('Error al agregar fusion:', error);
      res.status(500).json({ error: 'Error al agregar fusion' });
  }
});

// ----------------------------------------------------------------------------------------------------------------------


// Ruta para enviar correos de recuperación de contraseña
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'coursefollowupoficial@gmail.com',
    pass: 'mhxguhxlwvbgyede'
  }
});

app.post('/sendEmail', (req, res) => {
  console.log("ENTRO AL API")
  const { to, subject, body } = req.body;

  const mailOptions = {
    from: 'coursefollowupoficial@gmail.com',
    to,
    subject,
    text: body
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error al enviar el correo electrónico:', error);
      res.status(500).send('Error al enviar el correo electrónico');
    } else {
      console.log('Correo electrónico enviado:', info.response);
      res.send('Correo electrónico enviado con éxito');
    }
  });
});

// Ruta para recuperar contraseña de usuario
app.put('/usuarios/updatePassword', async (req, res) => {
  console.log("CAMBIAR CONTRASEÑA API");
  try {
    const { correo, nuevaContraseña } = req.body;
    
    // Buscar el correo desencriptado en el diccionario y obtener su forma encriptada correspondiente
    const correoEncriptado = correoMap[correo];

    if (correoEncriptado) {
        // Si se encuentra el correo buscado desencriptado, puedes usar su forma encriptada
        console.log('Correo desencriptado encontrado:', correo);
        console.log('Correo encriptado correspondiente:', correoEncriptado);

        const psswrdEncriptado = encryptData(nuevaContraseña);

        // Actualiza la contraseña encriptada en la base de datos para el usuario correspondiente
        const result = await db.query("UPDATE railway.usuario SET contraseña = ? WHERE correo = ?", [psswrdEncriptado, correoEncriptado]);

        if (result.affectedRows === 0) {
          res.status(404).json({ mensaje: 'Usuario no encontrado' });
        } else {
          res.status(200).json({ mensaje: 'Contraseña actualizada correctamente' });
        }

    } else {
        // Si el correo buscado desencriptado no se encuentra en el diccionario
        console.log('Correo desencriptado no encontrado');
    }

  } catch (error) {
      console.error('Error al actualizar contraseña:', error);
      res.status(500).json({ error: 'Error al actualizar contraseña' });
  }
});

// Ruta para obtener si hay una distancia de 2 meses entre cursos iguales
//0 es False, 1 es true
app.get('/distanciaCursosIguales/:nombreCurso/:fechaInicio/:fechaFinal', async (req, res) => {
  const { nombreCurso, fechaInicio, fechaFinal } = req.params;
  try {
    const resultado = await db.query("CALL  VerificarDistanciaCursos(?,?,?)", [nombreCurso, fechaInicio, fechaFinal]);
    res.json(resultado);
    
  } catch (error) {
    console.error('Error al obtener distancia de 2 meses:', error);
    res.status(500).json({ error: 'Error al obtener distancia de 2 meses' });
  }
});



// Ruta para obtener si hay una distancia de 1 SEMANA entre cursos de un MISMO GRUPOes
app.get('/validarDistanciaUnaSemana/:idGrupo/:fechaInicio', async (req, res) => {
  const { idGrupo,fechaInicio } = req.params;
  try {
    const resultado = await db.query("CALL VerificarDistanciaUnaSemana(?,?)", [idGrupo,fechaInicio]);
    res.json(resultado);

  } catch (error) {
    console.error('Error al obtener distancia de 1 semana:', error);
    res.status(500).json({ error: 'Error al obtener distancia de 1 semana' });
  }
});


// Iniciar el servidor
app.listen(port, () => {
  console.log(`El servidor está corriendo en http://localhost:${port}`);
});