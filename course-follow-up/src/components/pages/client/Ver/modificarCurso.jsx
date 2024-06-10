import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import Navbar from "../../shared/navbar";


// Código para la ventana donde se muestra 
// la información de UN curso específico


const Modificar_Curso = () => {
  const navigate = useNavigate();
  const mounted = useRef(false); // Declaramos mounted como un ref. Por bug que tiene el use effect
  const location = useLocation();

  //De la página anterior debemos traer 
// cursos, idCursoSeleccionado,cursoSeleccionado, grupo, idGrupo, horario
  const { idCurso} = location.state; //Este es el ID del cruso
  const {cursoSeleccionado} =  location.state; //Este es el OBJETO curso
  const {numero} = location.state;
  const { idGrupo } = location.state; //Este es el ID del grupo
  const { horario} = location.state; //Este es el horario del GRUPO


  console.log('VER AQUI FRAN: ', cursoSeleccionado);


  // Variables para guardar los cambios
  const [profesor, setProfesor] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFinal, setFechaFinal] = useState('');
  const [horarioCurso, setHorarioCurso] = useState(''); 

  //Modals para errores de fechas
  const [showWarning, setShowWarning] = useState(false); 
  const [warningMessage, setWarningMessage] = useState(''); // Mensaje de advertencia
  const [continueUpdate, setContinueUpdate] = useState(false);


  useEffect(() => {
    if (cursoSeleccionado) {
      const formattedStartDate = new Date(cursoSeleccionado.startDate).toISOString().split('T')[0];
      const formattedEndDate = new Date(cursoSeleccionado.endDate).toISOString().split('T')[0];
      setFechaInicio(formattedStartDate || '');
      setFechaFinal(formattedEndDate || '');
      setProfesor(cursoSeleccionado.profesor || '');
      setHorarioCurso(cursoSeleccionado.horario || '');
    }
    
  }, [cursoSeleccionado,horario]);
  
  //Validar que la fecha ingresada coincida con el día del horario
  const validarDiaFecha = () => {
    console.log("Validación dia-fecha");
    // Convertimos fechas a Date para poder usar getDay()
    const inicioDateObject = new Date(fechaInicio);
    const finDateObject = new Date(fechaFinal);

    // Obtener el día correspondiente a las fechas
    //(Domingo = 0, 1= Lunes, 2= Martes, 3=Miércoles, 4=Jueves, ..., 6 para Sábado)
    /**
     * EXPLICACIÓN:
     * Get day tiene un desfase, por lo que devuelve un día atrás las fechas. Ejemplo: El 01 de mayo 2024
     * lo identifica como martes, o sea (2) en vez de (3).
     * Para solucionar este problema se ha sumado "1" en todos los casos
     * Pero cuando se presenta el caso que una fecha es Domingo, get day la identifica como 6 y
     * nuestra solución lo pndría como 7 (valor inexistente en arreglo de días)
     * Por ende se ha implementado otra solución, cuando getday es =6, ponemos el valor en 0 (Domingo)
     */
    let diaInicio = 0;
    let diaFin = 0;
    if(inicioDateObject.getDay() === 6){
      diaInicio = 0;//Se pone en 0 representando al domingo
    }
    else{
       diaInicio = inicioDateObject.getDay() + 1 ; //Devuelve un int. Hay que sumarle 1 porque hay un desfaz en zonas horarias por el String
    }
     
    if(finDateObject.getDay() === 6){
      diaFin = 0;//Se pone en 0 representando al domingo
    }
    else{
      diaFin = finDateObject.getDay() + 1 ;  //Devuelve un int. Hay que sumarle 1 porque hay un desfaz en zonas horarias por el String
    }  
    const dias =['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
    console.log('diaInicio', diaInicio);
    console.log('diaFin',diaFin);

    //Si el horario del GRUPO es LYM.Los únicos días permitidos serían L(1) y M(3)
    if(horario === 'Lunes y Miércoles' || horario === 'L-M'){
      if(diaInicio !== 1 && diaInicio !== 3){
        setContinueUpdate(false);
        toast.error('La fecha de inicio seleccionada es: ' + dias[diaInicio] + '. No corresponde a Lunes ni Miércoles.');
        return;
      }
      if(diaFin !== 1 && diaFin !== 3){
        setContinueUpdate(false);
        toast.error('La fecha de finalización seleccionada es: ' + dias[diaFin] + '. No corresponde a Lunes ni Miércoles.');
        return;
      }
    }
    
    //Si el horario del GRUPO es KYJ. Los únicos días permitidos serían K(2) y J(4)
    if(horario === 'Martes y Jueves'|| horario === 'K-J'){
      if(diaInicio !== 2 && diaInicio !== 4){
        setContinueUpdate(false);
        toast.error('La fecha de inicio seleccionada es: ' + dias[diaInicio] + '. No corresponde a Martes ni Jueves');
        return;
      }
    
      if(diaFin !== 2 && diaFin !== 4){
        setContinueUpdate(false);
        toast.error('La fecha de finalización seleccionada es: ' + dias[diaFin] + '. No corresponde a Martes ni Jueves');
        return;
      }
    }
    setContinueUpdate(true); //Agregado ahorita fix bug 7 mayo

  }; //Fin validar dia fecha

  const validarDistanciaFechas = () =>{
    console.log("Validación duracion minimo 1 mes");
    // Validar que el curso dure mínimo 1 mes (haya una distancia mínima de 1 mes entre las fechas de INICIO y FIN)(OPCIONAL)
    const fechaInicioObj = new Date(fechaInicio);
    const fechaFinalObj = new Date(fechaFinal);
    const diferenciaMeses = (fechaFinalObj.getFullYear() - fechaInicioObj.getFullYear()) * 12 + fechaFinalObj.getMonth() - fechaInicioObj.getMonth();
    
    if (diferenciaMeses < 1) {
      setContinueUpdate(false); //Agregado fixing bug
      setWarningMessage('Entre la fecha de inicio y la fecha final hay menos de 1 mes. Esto puede afectar la planificación del curso. \n ¿Desea continuar de todos modos?');
      setShowWarning(true);
      return;
    }
    //setContinueUpdate(true); //Agregado fixing bug
  } //Fin validar distancia fechas

  //Validar que el horario del curso coincida con el horario del grupo (OPCIONAL QUE SE CUMPLA)
  const validarHorarioCursoGrupo = () => {  
    console.log("Validación horario grupo");
    console.log("Horario curso:",horarioCurso);
    console.log("Horario grupo:",horario);
    if (horarioCurso == "Lunes y Miércoles" && (horario !== "Lunes y Miércoles" && horario !== "L-M") ) { //Horario es horario del grupo
      setContinueUpdate(false);
      setWarningMessage('El horario del curso  no coincide con el horario del grupo al que está asignado. Esto podría causar conflictos en la planificación.\n  ¿Desea continuar de todos modos?');
      setShowWarning(true);
      return;
    }
    if (horarioCurso == "L-M" && (horario !== "Lunes y Miércoles" && horario !== "L-M")) { //Horario es horario del grupo
      setContinueUpdate(false);
      setWarningMessage('El horario del curso  no coincide con el horario del grupo al que está asignado. Esto podría causar conflictos en la planificación.\n  ¿Desea continuar de todos modos?');
      setShowWarning(true);
      return;
    }
    if (horarioCurso == "Martes y Jueves" && (horario !== "Martes y Jueves" && horario !== "K-J")) { //Horario es horario del grupo
      setContinueUpdate(false);
      setWarningMessage('El horario del curso  no coincide con el horario del grupo al que está asignado. Esto podría causar conflictos en la planificación.\n  ¿Desea continuar de todos modos?');
      setShowWarning(true);
      return;
    }
    if (horarioCurso == "K-J" && (horario !== "Martes y Jueves" && horario !== "K-J")) { //Horario es horario del grupo
      setContinueUpdate(false);
      setWarningMessage('El horario del curso  no coincide con el horario del grupo al que está asignado. Esto podría causar conflictos en la planificación.\n  ¿Desea continuar de todos modos?');
      setShowWarning(true);
      return;
    }
    //Agregar esto porque cuando termina de validar no continua
    //setShowWarning(false);
    //setContinueUpdate(true);
    
    return;
  } //Fin validar horario curso grupo

//Revisa que haya distancia de 2 MESES entre CURSOS IGUALES
const validarDistanciaCursosIguales = async () => { 
  console.log("Validación 2 meses");
  try {
    const cumpleDistancia = await axios.get(`http://localhost:3001/distanciaCursosIguales/${cursoSeleccionado.name}/${fechaInicio}/${fechaFinal}`);
   //Así se debe obtener la info de la respuesta de BD cumpleDistancia.data[0][0][0].cumpleDistancia);
    // 0 =False, 1=true
 
    if (cumpleDistancia.data[0][0][0].cumpleDistancia == 0) {
      setContinueUpdate(false); //Agregado fixing bug
      setWarningMessage('No se cumple la distancia de 2 meses entre cursos iguales.\n¿Desea continuar de todos modos?');
      setShowWarning(true);
      return;
    }
    
  } catch (error) {
    console.error('Error al verificar la distancia de 2 meses entre cursos iguales:', error);
    // Manejo del error
  }
}

//Revisa que haya distancia de UNA SEMANA entre cursos de UN MISMO GRUPO
const validarDistanciaUnaSemana = async () => { 
  console.log("Validación 1 semana");
  try {
    const cumpleDistancia = await axios.get(`http://localhost:3001/validarDistanciaUnaSemana/${idGrupo}/${fechaInicio}`);
    
    if (cumpleDistancia.data[0][0][0].cumpleDistancia==0) {
      setContinueUpdate(false); //Agregado fixing bug
      setWarningMessage('No se cumple la distancia de 1 semana respecto al último curso impartido a este grupo.\n¿Desea continuar de todos modos?');
      setShowWarning(true);
      return;
    }
  } catch (error) {
    console.error('Error al verificar la distancia de 1 semana entre cursos del mismo grupo:', error);
    // Manejo del error
  }
}

  /**
   * 
   * Bug to fix: Que cuando se cambie de horario, obligue a cambiar fechas de inicio y fin
   */
  const handleConfirmar = () => {
    console.log("Manejando confirmación...");
    //V#1.Validar que no haya información en blanco (El profe puede quedar en blanco)
    console.log("Validación espacios en blanco");
    if (!fechaInicio || !fechaFinal || !horarioCurso) {
        console.log("Fecha inicio: ", fechaInicio);
        console.log("Fecha final: ", fechaFinal);
        console.log("Horario Curso: ", horarioCurso);
        console.log("Profesor: ", profesor);
      toast.error('Por favor completa todos los campos');
      return;
    }
    //V#2.Validar que la fecha ingresada coincida con el día del horario
    validarDiaFecha();  
    // V#5. Validar que el horario del curso coincida con el horario del grupo (OPCIONAL QUE SE CUMPLA)
    validarHorarioCursoGrupo();
    //V#3.Validar que las fechas tengan concordancia
    console.log("Validación concordancia fechas");
    if (fechaInicio > fechaFinal) {
      setContinueUpdate(false);
      toast.error('La fecha de inicio debe ser anterior a la fecha final');
      return;
    }
    // V#6. Validar distancia de 2 meses entre cursos iguales
    validarDistanciaCursosIguales();

    // V#4. Validar que haya una distancia mínima de 1 mes entre las fechas (OPCIONAL QUE SE CUMPLA)
    validarDistanciaFechas();

    // V#7. Validar distancia de 1 semana entre cursos de de un mismo GRUPO
    validarDistanciaUnaSemana();

    // NO SIRVE PONERLO ACÁAAA. Hay que dejarlo comentado si no muestra el modal y la actualización at the same time
    //setContinueUpdate(true);
 
  };

  useEffect(() => {

    
    if (!continueUpdate){
      console.log("Continue Update Falso.");
      console.log("Cup: ",continueUpdate);
      return;
    }; // No hacer nada si continueUpdate sigue siendo false
    console.log("Estamos entrando al Use Effect después de validaciones");
  
    // Si no hay advertencias o el usuario ha confirmado continuar, continuar con la actualización
    if (continueUpdate) {
      axios.post('http://localhost:3001/actualizarCursos', {
          idGrupo: idGrupo,
          idCurso: idCurso,
          fechaInicio: fechaInicio,
          fechaFinal: fechaFinal,
          profesor: profesor,
          horario: horarioCurso
      })
      .then(response => {
          console.log('Curso actualizado correctamente:', response.data);
          /** 
           * Se agrega el set time out porque no le estaba dando tiempo al toast de mostrarse
           * antes de que la pantalla se redirigiera a la lista de cursos
           */
          toast.success("Curso actualizado correctamente");
          //navigate('/AgregarCursos', { state: { idGrupo, numero, horario } }); // Redirigir a la página deseada
          setTimeout(() => {
            navigate('/AgregarCursos', { state: { idGrupo, numero, horario } });
          }, 2000); // 2000 milisegundos = 2 segundos
      })
      .catch(error => {
          //alert("Error al actualizar curso");
          console.error('Error al actualizar curso:', error);
          toast.error("Error al actualizar el curso");
      });
    }
  }, [continueUpdate,showWarning]);    

    const handleChange = (e) => {
        // console.log("Profesor: ", profesor);
        // console.log("Profesor .: ", cursoSeleccionado.profesor);
        console.log('INFO DEL SELECT')
        console.log(e.target.value)
        setHorarioCurso(e.target.value);
    };

    const handleBack = () => {
      
        navigate('/SeleccionaAño', {});
    };

    //Maneja lo que se hace después de que la persona desee seguir actualizando cuando:
    //  1. No coincide el horario curso con horario grup
    //  2. No hay duración mínima de un mes en el curso
    const handleContinue = () => {
      console.log("Continuar actualización...");
      setShowWarning(false);
      setContinueUpdate(true);
      console.log("showWarning:", showWarning); 
      console.log("continueUpdate:", continueUpdate); 
    };
    
    const handleCerrarModal = () =>{
      setShowWarning(false);
      setContinueUpdate(false);
      console.log("showWarning:", showWarning); // Agrega esta línea
      console.log("continueUpdate:", continueUpdate); // Agrega esta línea
    };


    return (
      <div>
        <Navbar />
        <div className="container" style={{ paddingTop: '80px' }}>
          <ToastContainer position="top-center"/>
          <h3>Agregar Planificación</h3>
          {showWarning && (
            <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
              <div className="modal-dialog" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Advertencia</h5>
                    <button type="button" className="btn-close" onClick={handleCerrarModal}></button>
                  </div>
                  <div className="modal-body">
                    {warningMessage}
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={handleCerrarModal}>Cerrar</button>
                    <button type="button" className="btn btn-primary" onClick={handleContinue}>Continuar</button>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="row">
            <div className="col">
              <div className="form-group">
                <span className="badge bg-light text-dark">
                  <h5>Grupo:</h5>
                  <h5>{numero}</h5> 
                </span>
              </div>
            </div>
            <div className="col">
              <div className="form-group">
                <span className="badge bg-light text-dark">
                  <h5>Horario del grupo:</h5>
                  <h5>{horario}</h5>  
                </span>
              </div>
            </div>
          </div>
          <br></br>
          <div className="row">
            <div className="col-md-12 mb-12">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{cursoSeleccionado.name}</h5>
                  <div className="form-group">
                    <label>Profesor:</label>
                    <input
                      type="text"
                      className="form-control"
                      value={profesor}
                      onChange={(e) => setProfesor(e.target.value)}
                    />
                  </div>
                  <div className='form-group'>
                    <label>Fecha Inicio:</label>
                    <input
                      type="date"
                      className="form-control"
                      value={fechaInicio}
                      onChange={(e) => setFechaInicio(e.target.value)}
                    />
                  </div>
                  <div className='form-group'>
                    <label>Fecha Final:</label>
                    <input
                      type="date"
                      className="form-control"
                      value={fechaFinal}
                      onChange={(e) => setFechaFinal(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Horario:</label>
                    <select 
                    className="form-select form-select-sm" 
                    aria-label=".form-select-sm example" 
                    onChange={handleChange}
                    value={
                      horarioCurso === 'Lunes y Miércoles' ? 'L-M' :
                      horarioCurso === 'Martes y Jueves' ? 'K-J' :
                      horarioCurso // Si no coincide con ninguno de los casos anteriores, se utiliza el valor actual de horarioCurso
                    }
                  >
                    <option value="L-M">L-M</option>
                    <option value="K-J">K-J</option>
                  </select>
                  </div>
                  <button className="btn btn-success m-4" onClick={handleConfirmar}>Confirmar cambios</button>
                </div>
              </div>
            </div>
          </div>
          <div className="m-3">
            <hr />
            <button className="btn btn-danger m-4" onClick={handleBack}>Volver</button>
          </div>
        </div>
      </div>
    );
  };
  
  export default Modificar_Curso;