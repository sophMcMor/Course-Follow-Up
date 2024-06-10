import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from 'axios';
import Navbar from "../../shared/navbar";
import { useToastContainer } from 'react-toastify';

// Código para la ventana donde hay una lista de cursos 
// para un determinado grupo
// y se selecciona uno para agregarle información.

const Agregar_Cursos = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const idGrupo = location?.state?.idGrupo;
  const numero = location?.state?.numero;
  const horario = location?.state?.horario;

  console.log('INFO: ', idGrupo, ' ',numero, ' ', horario);

  const [cursos, setCursos] = useState([]);
  const [idCursoSeleccionado, setidCursoSeleccionado] = useState(null); //Indice del curso seleccionado
  const [idCurso, setIdCurso] = useState("");
  const [cursoSeleccionado, setCursoSeleccionado] = useState(""); // curso seleccionado

  const handleCheckboxChange = (index) => {
    if (idCursoSeleccionado === index) {
        console.log("id del curso: ", idCursoSeleccionado);
        console.log("index: ", index);
        setidCursoSeleccionado(null);
        setCursoSeleccionado(""); // Limpiar el estado curso
    } else {
        setidCursoSeleccionado(index); //indice del curso
        console.log("Esto se guarda CURSOS: ", cursos);
        console.log("Esto se guarda CURSOS[INDEX]: ", cursos[index]);
        console.log("Esto se guarda como idCurso: ", cursos[index].idCurso);
        setIdCurso(cursos[index].idCurso);
        setCursoSeleccionado(cursos[index]); 
    }
  };

  // Carga todos los cursos de la BD en la lista "cursos" 
  useEffect(() => {
    axios.get(`http://localhost:3001/cursos/${idGrupo}`)
      .then(response => {
        console.log('cursos111: ', response.data[0]);
        setCursos(response.data[0]);
      })
      .catch(error => {
        console.log('ERROR: Carga fallida de cursos', error);
      });
     

  }, []); // Grupo como dependencia para recargar los cursos cuando cambie

  useEffect(() => {
    // Este se ejecuta cuando cursos cambie
    console.log('cursos: ', cursos[0]);
}, [cursos]);

  const handleBack = () => {
    navigate('/AgregarGrupo',{});
  };

  //A la siguiente pestaña hay que enviar Cursos, curso seleccionado, grupo, horario
  const handleContinuar = () => {
    //REVISAR QUE HAYA SELECCIONADO UN CURSO
    console.log('Curso seleccionado: ', cursoSeleccionado);
    console.log('ID seleccionado: ', idCurso);
    if(cursoSeleccionado ===  ""){
      alert("Debe seleccionar un curso")
    }
    else{
      navigate('/AgregarCursoIndividual', { state: { cursos, idCurso, cursoSeleccionado, idGrupo, numero, horario } }); // Pasar el nombre del planificador seleccionado
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container" style={{ paddingTop: '80px' }}>
        <h3 style={{ color: 'white'}}>Agregar Cursos</h3>
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
        <div className="row">
        <label style={{ color: 'white'}}>Seleccione un curso:</label>
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
                                            checked={idCursoSeleccionado === index}
                                            onChange={() => handleCheckboxChange(index)}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
          </div>
        </div>


        <div className="m-3">
                            <hr />
                            <button className="btn btn-back m-4" onClick={handleBack}>Volver</button>
                            <button className="btn btn-primary m-4" onClick={handleContinuar}>
                                Continuar
                            </button>
                        </div>
        </div>


        {/* Resto del contenido */}
      </div>
    </div>
  );
};

export default Agregar_Cursos;