import Navbar from "../../shared/navbar";
import { Link, useNavigate, useLocation} from "react-router-dom";

function Opciones () {
    const navigate = useNavigate();
    const location = useLocation();

    const idgrupoXcurso =location?.state?.idgrupoXcurso;
    const grupo_id = location?.state?.grupo_id;
    const grupoNumero = location?.state?.grupoNumero;
    const idcurso = location?.state?.idcurso;
    const cursoNombre = location?.state?.cursoNombre;
    const cursoSeleccionado = location?.state?.cursoSeleccionado;
    const horario = location?.state?.horario;
    const fechaInicio = location.state.fechaInicio;
    const fechaFinal = location.state.fechaFinal;
    const añoPlanificador = location.state.añoPlanificador;
    
    console.log('idgrupoXcurso ', idgrupoXcurso);
    console.log('curso id ', idcurso);

    
    const handleIntercambiar = () => {
        navigate('/IntercambiarCursos',{state:{idGrupo:grupo_id, numero:grupoNumero, idCurso:idcurso,
            nombreCurso:cursoNombre, añoPlanificador: añoPlanificador, fechaInicioPlanificador:fechaInicio,
            fechaFinalPlanificador:fechaFinal, idgrupoXcurso: idgrupoXcurso}});
    };

    const handleFusionar = () =>{
        navigate('/FusionarGrupo',{state:{idgrupoXcurso: idgrupoXcurso, grupo_id: grupo_id, grupoNumero: grupoNumero, idcurso: idcurso, cursoNombre: cursoNombre, fechaInicio: fechaInicio, 
            fechaFinal: fechaFinal, añoPlanificador: añoPlanificador}});
    }

    const handleBack = () =>{
        navigate('/App',{state:{fechaInicio:fechaInicio, fechaFinal:fechaFinal, añoPlanificador: añoPlanificador}});
    }

    return(
        <div>
    <Navbar/>
    <div className="container d-flex flex-column align-items-center justify-content-center vh-100">
        <h1 className="mb-4">Course Follow-Up</h1>
        <div className="card m-4 text-center" style={{ width: '500px'}}>
            <div className="card-header">
                <h2>Opciones</h2>
            </div>
            <div className="card-body">
                
                <div className="m-3">
                    <button className="btn btn-light btn-lg" style={{ width: '100%' }} onClick={handleFusionar}>Fusionar Grupo</button>
                </div>
                <div className="m-3">
                    <button className="btn btn-light btn-lg" style={{ width: '100%' }} onClick={handleIntercambiar}>Intercambiar Curso</button>
                </div>
                <div className="m-3">
                    <button className="btn btn-danger btn-lg" style={{ width: '100%' }} onClick={handleBack}>Volver</button>
                </div>
            </div>
        </div>
    </div>
</div>


    );
}

export default Opciones;