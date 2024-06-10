import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import Navbar from "../../shared/navbar";

const AgregarCursosIndiv = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cursos, idCurso, cursoSeleccionado, numero, idGrupo, horario } = location.state;

  const [profesor, setProfesor] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFinal, setFechaFinal] = useState('');
  const [horarioCurso, setHorarioCurso] = useState('');
  const [jornadaCurso, setJornadaCurso] = useState('');

  const [showWarning, setShowWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');
  const [validationIndex, setValidationIndex] = useState(0);

  useEffect(() => {
    if (cursoSeleccionado) {
      setProfesor(cursoSeleccionado.profesor || '');
      setFechaInicio(cursoSeleccionado.fechaInicio || '');
      setFechaFinal(cursoSeleccionado.fechaFinal || '');
      setHorarioCurso(cursoSeleccionado.horario || horario || '');
      setJornadaCurso(cursoSeleccionado.jornada || '');
    }
  }, [cursoSeleccionado, horario]);

  const validarDiaFecha = () => {
    const inicioDateObject = new Date(fechaInicio);
    const finDateObject = new Date(fechaFinal);

    let diaInicio = inicioDateObject.getDay() === 6 ? 0 : inicioDateObject.getDay() + 1;
    let diaFin = finDateObject.getDay() === 6 ? 0 : finDateObject.getDay() + 1;
    const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

    if (horarioCurso === 'Lunes y Miércoles' || horarioCurso === 'L-M') {
      if (diaInicio !== 1 && diaInicio !== 3) {
        toast.error('La fecha de inicio seleccionada es: ' + dias[diaInicio] + '. No corresponde a Lunes ni Miércoles.');
        return false;
      }
      if (diaFin !== 1 && diaFin !== 3) {
        toast.error('La fecha de finalización seleccionada es: ' + dias[diaFin] + '. No corresponde a Lunes ni Miércoles.');
        return false;
      }
    }

    if (horarioCurso === 'Martes y Jueves' || horarioCurso === 'K-J') {
      if (diaInicio !== 2 && diaInicio !== 4) {
        toast.error('La fecha de inicio seleccionada es: ' + dias[diaInicio] + '. No corresponde a Martes ni Jueves');
        return false;
      }
      if (diaFin !== 2 && diaFin !== 4) {
        toast.error('La fecha de finalización seleccionada es: ' + dias[diaFin] + '. No corresponde a Martes ni Jueves');
        return false;
      }
    }
    return true;
  };

  const validarDistanciaFechas = () => {
    const fechaInicioObj = new Date(fechaInicio);
    const fechaFinalObj = new Date(fechaFinal);
    const diferenciaMeses = (fechaFinalObj.getFullYear() - fechaInicioObj.getFullYear()) * 12 + fechaFinalObj.getMonth() - fechaInicioObj.getMonth();

    if (diferenciaMeses < 1) {
      setWarningMessage('Entre la fecha de inicio y la fecha final hay menos de 1 mes. Esto puede afectar la planificación del curso. \n ¿Desea continuar de todos modos?');
      setShowWarning(true);
      return false;
    }
    return true;
  };

  const validarHorarioCursoGrupo = () => {
    if ((horarioCurso === "Lunes y Miércoles" || horarioCurso === "L-M") && (horario !== "Lunes y Miércoles" && horario !== "L-M")) {
      setWarningMessage('El horario del curso no coincide con el horario del grupo al que está asignado. Esto podría causar conflictos en la planificación.\n  ¿Desea continuar de todos modos?');
      setShowWarning(true);
      return false;
    }
    if ((horarioCurso === "Martes y Jueves" || horarioCurso === "K-J") && (horario !== "Martes y Jueves" && horario !== "K-J")) {
      setWarningMessage('El horario del curso no coincide con el horario del grupo al que está asignado. Esto podría causar conflictos en la planificación.\n  ¿Desea continuar de todos modos?');
      setShowWarning(true);
      return false;
    }
    return true;
  };

  const validarDistanciaCursosIguales = async () => {
    try {
      const cumpleDistancia = await axios.get(`http://localhost:3001/distanciaCursosIguales/${cursoSeleccionado.nombre_curso}/${fechaInicio}/${fechaFinal}`);
      if (cumpleDistancia.data[0][0][0].cumpleDistancia == 0) {
        setWarningMessage('No se cumple la distancia de 2 meses entre cursos iguales.\n¿Desea continuar de todos modos?');
        setShowWarning(true);
        return false;
      }
    } catch (error) {
      console.error('Error al verificar la distancia de 2 meses entre cursos iguales:', error);
    }
    return true;
  };

  const validarDistanciaUnaSemana = async () => {
    try {
      const cumpleDistancia = await axios.get(`http://localhost:3001/validarDistanciaUnaSemana/${idGrupo}/${fechaInicio}`);
      if (cumpleDistancia.data[0][0][0].cumpleDistancia == 0) {
        setWarningMessage('No se cumple la distancia de 1 semana respecto al último curso impartido a este grupo.\n¿Desea continuar de todos modos?');
        setShowWarning(true);
        return false;
      }
    } catch (error) {
      console.error('Error al verificar la distancia de 1 semana entre cursos del mismo grupo:', error);
    }
    return true;
  };

  const handleConfirmar = async () => {
    if (!fechaInicio || !fechaFinal || !horarioCurso) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    const validations = [
      { func: validarDiaFecha, isAsync: false },
      { func: validarHorarioCursoGrupo, isAsync: false },
      { func: () => fechaInicio <= fechaFinal, isAsync: false, errorMessage: 'La fecha de inicio debe ser anterior a la fecha final' },
      { func: validarDistanciaCursosIguales, isAsync: true },
      { func: validarDistanciaFechas, isAsync: false },
      { func: validarDistanciaUnaSemana, isAsync: true },
    ];

    for (let i = 0; i < validations.length; i++) {
      const { func, isAsync, errorMessage } = validations[i];
      const result = isAsync ? await func() : func();
      if (!result) {
        if (errorMessage) {
          toast.error(errorMessage);
        } else {
          setValidationIndex(i);
        }
        return;
      }
    }

    actualizarCurso();
  };

  const actualizarCurso = () => {
    axios.post('http://localhost:3001/actualizarCursos', {
      idGrupo: idGrupo,
      idCurso: idCurso,
      fechaInicio: fechaInicio,
      fechaFinal: fechaFinal,
      profesor: profesor,
      horario: horarioCurso,
      jornada: jornadaCurso,
    })
    .then(response => {
      console.log('Curso actualizado correctamente:', response.data);
      toast.success("Curso actualizado correctamente");
      setTimeout(() => {
        navigate('/AgregarCursos', { state: { idGrupo, numero, horario } });
      }, 3000);
    })
    .catch(error => {
      console.error('Error al actualizar curso:', error);
      toast.error("Error al actualizar el curso");
    });
  };

  const handleContinue = async () => {
    setShowWarning(false);
    const validations = [
      { func: validarDiaFecha, isAsync: false },
      { func: validarHorarioCursoGrupo, isAsync: false },
      { func: () => fechaInicio <= fechaFinal, isAsync: false, errorMessage: 'La fecha de inicio debe ser anterior a la fecha final' },
      { func: validarDistanciaCursosIguales, isAsync: true },
      { func: validarDistanciaFechas, isAsync: false },
      { func: validarDistanciaUnaSemana, isAsync: true },
    ];

    for (let i = validationIndex + 1; i < validations.length; i++) {
      const { func, isAsync, errorMessage } = validations[i];
      const result = isAsync ? await func() : func();
      if (!result) {
        if (errorMessage) {
          toast.error(errorMessage);
        } else {
          setValidationIndex(i);
        }
        return;
      }
    }

    actualizarCurso();
  };

  const handleCancel = () => {
    setShowWarning(false);
    setValidationIndex(0);
  };

  const handleCerrarModal = () => {
    setShowWarning(false);
  };

  const handleBack = () => {
    navigate('/AgregarCursos', { state: { idGrupo, numero, horario } });
  };

  const handleChange = (e) => {
    setHorarioCurso(e.target.value);
  };

  const handleChangeJornada = (e) => {
    setJornadaCurso(e.target.value);
  };
  return (
<div>
  <Navbar />
  <div className="container" style={{ paddingTop: '80px' }}>
    <ToastContainer position="top-center" />
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
                  <button type="button" className="btn btn-secondary" onClick={handleCancel}>Cerrar</button>
                  <button type="button" className="btn btn-primary" onClick={handleContinue}>Continuar</button>
                </div>
              </div>
            </div>
          </div>
        )}
    <div className="row">
    <h3 style={{ color: 'white'}}>Agregar Planificación</h3>
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
      <div className="col-md-12 mb-12">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">{cursoSeleccionado.nombre_curso}</h5>
            <div className="form-group">
              <label>Profesor:</label>
              <input
                type="text"
                className="form-control"
                value={profesor}
                onChange={(e) => setProfesor(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Fecha Inicio:</label>
              <input
                type="date"
                className="form-control"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
              />
            </div>
            <div className="form-group">
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
                  horarioCurso === 'Lunes y Miércoles'
                    ? 'L-M'
                    : horarioCurso === 'Martes y Jueves'
                    ? 'K-J'
                    : horarioCurso
                }
              >
                <option value="L-M">L-M</option>
                <option value="K-J">K-J</option>
              </select>
            </div>

            <div className="form-group">
              <label>Jornada:</label>
              <select
                className="form-select form-select-sm"
                aria-label=".form-select-sm example"
                onChange={handleChangeJornada}
                value={jornadaCurso}
              >
                <option value="Diurno">Diurno☀️</option>
                <option value="Nocturno">Nocturno🌒</option>
              </select>
            </div>
            <div className="d-flex justify-content-between">
            <button className="btn btn-danger m-4" onClick={handleBack}>
                Volver
              </button>
              <button className="btn btn-success m-4" onClick={handleConfirmar}>
                Confirmar cambios
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>


  );
};

export default AgregarCursosIndiv;
