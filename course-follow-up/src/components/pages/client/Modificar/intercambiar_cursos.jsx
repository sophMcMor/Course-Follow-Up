import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import axios from 'axios';
import Navbar from "../../shared/navbar";

const Intercambiar_Cursos = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { idgrupoXcurso } = location.state;
  const {idGrupo} = location.state; // ID grupo entrante
  const {numero} = location.state; // Numero de grupo
  const {idCurso} = location.state; // ID Curso seleccionado para ser intercambiado
  const {nombreCurso} = location.state; // Nombre del curso
  const {añoPlanificador} = location.state; // Año del planificador seleccionado
  const {fechaInicioPlanificador} = location.state; // Fecha de inicio del planificador
  const {fechaFinalPlanificador} = location.state; // Fecha final del planificador

  console.log('INFO: ', idGrupo, ' ',numero);
  
  const [cursos, setCursos] = useState([]); // Información de los cursos
  const [idCursoSeleccionado, setidCursoSeleccionado] = useState(null); // Indice del curso seleccionado
  const [cursoSeleccionado, setCursoSeleccionado] = useState(""); // Nombre del curso seleccionado

  // Carga todos los cursos de la BD en la lista "cursos" 
  useEffect(() => {
    axios.get(`http://localhost:3001/cursosAgregados/${idGrupo}`)
      .then(response => {
        setCursos(response.data[0]);
      })
      .catch(error => {
        console.log('ERROR: Carga fallida de cursos', error);
      });
  }, []);

  useEffect(() => {
    console.log("idCursoSeleccionado: " + idCursoSeleccionado)
  }, [idCursoSeleccionado]);

  // MODIFICAR
  // Esto es para regresar a la pantalla anterior
  const handleBack = () => {
    navigate('/Opciones', { state: {idgrupoXcurso:idgrupoXcurso, grupo_id:idGrupo, grupoNumero:numero, idcurso:idCurso,
      cursoNombre:nombreCurso, añoPlanificador:añoPlanificador, fechaInicio:fechaInicioPlanificador, fechaFinal:fechaFinalPlanificador } });
  };

  // Actaliza el valor del curso seleccionado según el checkbox seleccionado
  const handleCheckboxChange = (index) => {
    if (idCursoSeleccionado === cursos[index].idCurso) {
        setidCursoSeleccionado(null);
        setCursoSeleccionado(""); // Limpiar el estado curso
    } else {
        setidCursoSeleccionado(cursos[index].idCurso); //indice del curso
        setCursoSeleccionado(cursos[index]);
    }
  };

  // Acción realizada al presionar confirmar
  const handleConfirmar = () => {
    // Debe haber un curso seleccionado
    if(cursoSeleccionado ===  ""){
      alert("Debe seleccionar un curso")
      return;
    }

    // Se le consulta al usuario si está seguro del cambio. En caso afirmativo, se procede a hacer el request
    // para modificar la base de datos
    if (confirm("¿Seguro que desea intercambiar los cursos seleccionados?")){
      axios.put('http://localhost:3001/intercambiarCursos', {
          idGrupo: idGrupo,
          idCurso1: idCurso,
          idCurso2: idCursoSeleccionado,
      })
      .then(response => { // En caso de que todo salga bien
          console.log('Cursos intercambiados correctamente:', response.data);
          alert("Cursos intercambiados correctamente");
          navigate('/App', { state: { añoPlanificador:añoPlanificador, fechaInicio:fechaInicioPlanificador, fechaFinal:fechaFinalPlanificador } });
      }) // En caso de que haya un error
      .catch(error => {
          console.error('Error al actualizar curso:', error);
          alert("Error al actualizar el curso");
      });
    }
  };

  return (
    <div>
      <Navbar/>
      <div className="container justify-content-center align-items-center vh-100" style={{ paddingTop: '100px' }}>
        <div className="card">
          <div className="card-body">
            <p className="card-text">Intercambiar el curso <b><i>{nombreCurso}</i></b> del <b>Grupo {numero}</b> con:</p>
            <div className="form-group">
              <label>Seleccione un curso:</label>
              <div className="table-responsive" style={{ maxHeight: '300px' }}>
                <table className="table">
                  <thead>
                    <tr>
                      <th>No.</th>
                      <th>Curso</th>
                      <th>Seleccionar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cursos.map((curso, index) => (
                        <tr key={index}>
                          <td>{index+1}</td>
                          <td>{curso.nombre_curso}</td>
                          <td>
                            <input
                                type="checkbox"
                                disabled={idCurso-1 === index}
                                checked={idCursoSeleccionado === cursos[index].idCurso}
                                onChange={() => handleCheckboxChange(index)}
                            />
                          </td>
                        </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <button className="btn btn-danger m-3" onClick={handleBack}>Volver</button>
            <button className="btn btn-primary m-3" onClick={handleConfirmar}>Confirmar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Intercambiar_Cursos;