import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from 'axios';

const App1 = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const adminStatus = sessionStorage.getItem('isAdmin') === '1';
        setIsAdmin(adminStatus);
    }, []);

  const location = useLocation();
  const fechaInicioObtenido = location.state.fechaInicio;
  const fechaFinalObtenido = location.state.fechaFinal;
  const añoPlanificadorObtenido = location.state.añoPlanificador;

  const [courses, setCourses] = useState([]);
  const [fusiones, setFusiones] = useState([]);

  const [añoPlanificador, setAñoPlanificador] = useState(añoPlanificadorObtenido);
  const [fechaInicio, setFechaInicio] = useState(fechaInicioObtenido);
  const [fechaFinal, setFechaFinal] = useState(fechaFinalObtenido);

  console.log('FechaInicio: ', fechaInicio,' FechaFinal: ', fechaFinal, ' año: ', añoPlanificador);

  useEffect(() => {
    // Guarda los estilos anteriores para restaurarlos después
    const previousStyles = {
      background: document.body.style.background,
    };

    // Aplica los nuevos estilos
    document.body.style.background = '#ffffff';

    // Restaura los estilos anteriores cuando el componente se desmonta
    return () => {
      document.body.style.background = previousStyles.background;
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesResponse, fusionesResponse] = await Promise.all([
          axios.get(`http://localhost:3001/cursosXFecha?fechaInicio=${fechaInicio}&fechaFinal=${fechaFinal}`),
          axios.get('http://localhost:3001/fusiones')
        ]);
  
        const groupedCourses = groupCoursesByGroup(coursesResponse.data);
        setCourses(groupedCourses);
        setFusiones(fusionesResponse.data);
      } catch (error) {
        console.error('Error al obtener datos:', error);
      }
    };
  
    fetchData();
  }, [fechaInicio, fechaFinal]);

  useEffect(() => {
    const fechaInicio = `${añoPlanificador}-01-01`;
    const fechaFinal = `${añoPlanificador}-12-31`;
    setFechaInicio(fechaInicio);
    setFechaFinal(fechaFinal);
  }, [añoPlanificador])


  const groupCoursesByGroup = (data) => {
    const groupMap = new Map();

    data.forEach((course) => {
      console.log('AQUI FRAN2: ', course.idcurso);
      const { grupoNumero, grupoHorario } = course;
      const groupId = `#${grupoNumero}`;

      if (!groupMap.has(groupId)) {
        groupMap.set(groupId, {
          groupId,
          color: getRandomColor(),
          horario: grupoHorario,
          courses: [],
        });
      }

      const group = groupMap.get(groupId);
      group.courses.push({
        idgrupoXcurso: course.idgrupoXcurso,
        grupo_id: course.idgrupo,
        idGRUPO: course.grupoNumero,
        id: course.idcurso,
        name: course.cursoNombre,
        startDate: new Date(course.fechaInicio),
        endDate: new Date(course.fechaFinal),
        profesor: course.profesor,
        horario: course.cursoHorario,
        jornada: course.jornada,
      });
    });

    return Array.from(groupMap.values());
  };


  const getFusionesForIdGrupoXCurso = (idgrupoXcurso, fusiones) => {
    const fusionesRelacionadas = [];
  
    fusiones.forEach(fusion => {
      if (fusion.idgrupoXcurso1 === idgrupoXcurso) {
        fusionesRelacionadas.push(fusion.numero_grupo_2);
      } else if (fusion.idgrupoXcurso2 === idgrupoXcurso) {
        fusionesRelacionadas.push(fusion.numero_grupo_1);
      }
    });
  
    return fusionesRelacionadas;
  };

  const getRandomColor = () => {
    const colors = ['#ffc107', '#28a745', '#007bff', '#dc3545', '#6610f2', '#e83e8c', '#20c997', '#fd7e14', '#891652', '#0B60B0', 
    '#7E6363', '#116D6E', '#E96479', '#43766C', '#CD5C08', '#BE3144', '#9A3B3B', '#1B4242', '#363062', '#8B9A46', '#2D4263', '#C060A1', 
    '#FFAC41'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

  const handlePrevious = () =>{
    setAñoPlanificador(`${parseInt(añoPlanificador, 10) - 1}`)
  };

  const handleNext = () =>{
    setAñoPlanificador(`${parseInt(añoPlanificador, 10) + 1}`)
  };

  const handleBack = () =>{
    navigate('/SeleccionaAño',{});
  };


  const handleOpciones = (idgrupoXcurso, grupo_id, grupoNumero, idcurso, cursoNombre, cursoSeleccionado, horario ) =>{
    alert(idgrupoXcurso);
    navigate('/Opciones',{state:{idgrupoXcurso: idgrupoXcurso, grupo_id: grupo_id, grupoNumero: grupoNumero, idcurso: idcurso, cursoNombre: cursoNombre, fechaInicio: fechaInicio, fechaFinal: fechaFinal, 
      añoPlanificador: añoPlanificador, cursoSeleccionado: cursoSeleccionado, horario: horario}});
  }


  return (
    <div>
      <h1 className="mb-4">Planificador de Cursos {añoPlanificador}</h1>
      <div className="d-flex">
        <button className="text-black bg-transparent border-0 p-0" onClick={handlePrevious}>
          <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" className="bi bi-arrow-left-circle" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z"/>
          </svg>
        </button>
        <table className="table m-2">
          <thead>
            <tr>
              <th>Grupo</th>
              {months.map((month) => (
                <th key={month}>{month}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {courses.map((group) => (
              <tr key={group.groupId}>
                <td style={{ backgroundColor: group.color, color: 'white', fontWeight: 'bold' }}>
                  {group.groupId} - {group.horario}
                </td>
                {months.map((month, index) => (
                  <td key={`${group.groupId}-${index}`}>
                    {group.courses
                      .filter(
                        (course) =>
                          new Date(course.startDate).getMonth() === index ||
                          new Date(course.endDate).getMonth() === index
                      )
                      .map((course) => (
                        <div key={course.id} style={{ backgroundColor: group.color, color: 'white', padding: '5px' }}>
                          <hr />
                          <button className="btn btn-light" disabled={!isAdmin} onClick={() => handleOpciones(course.idgrupoXcurso, course.grupo_id, course.idGRUPO, course.id, course.name, course, course.horario)}>Opciones</button>
                          <br />
                          {course.name}
                          <br />
                          {new Date(course.startDate).getMonth() === index && (
                            <>
                              Inicio: {new Date(course.startDate).getDate()} {months[new Date(course.startDate).getMonth()]}
                              <br />
                            </>
                          )}
                          {new Date(course.endDate).getMonth() === index && (
                            <>
                              Fin: {new Date(course.endDate).getDate()} {months[new Date(course.endDate).getMonth()]}
                              <br />
                            </>
                          )}
                          Horario: {course.horario}
                          <br />
                          Jornada: {course.jornada}
                          <div>
                          <strong>Fusión:</strong>{' '}
                            {fusiones.length > 0 &&
                              getFusionesForIdGrupoXCurso(course.idgrupoXcurso, fusiones).map((fusion, index) => (
                                <span key={index}>
                                  #{fusion}
                                  {index < getFusionesForIdGrupoXCurso(course.idgrupoXcurso, fusiones).length - 1 ? ' - ' : ''}
                                </span>
                              ))}
                          </div>
                        </div>
                      ))}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <button className="text-black bg-transparent border-0 p-0" onClick={handleNext}>
          <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" className="bi bi-arrow-right-circle" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0M4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z"/>
          </svg>
        </button>
      </div>
      <div>
        <button className="btn btn-back" onClick={handleBack}>Volver</button>
      </div>
    </div>
  );
}

export default App1
