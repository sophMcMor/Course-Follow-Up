import Navbar from "../../shared/navbar";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from 'axios';

function Fusionar_Grupo() {
    const navigate = useNavigate();
    const location = useLocation();

    const idgrupoXcurso1 =location?.state?.idgrupoXcurso;
    const grupo_id = location?.state?.grupo_id;
    const grupoNumero = location?.state?.grupoNumero;
    const idcurso = location?.state?.idcurso;
    const cursoNombre = location?.state?.cursoNombre;
    const fechaInicio = location.state.fechaInicio;
    const fechaFinal = location.state.fechaFinal;
    const añoPlanificador = location.state.añoPlanificador;
    
    const [gruposExistentes, setGruposExistentes] = useState([]);
    const [grupoSeleccionado, setGrupoSeleccionado] = useState(null);
    const [idgrupoXcurso, setidgrupoXcurso] = useState("");
    const [fusiones, setFusiones] = useState([]);

    console.log('ver estoooooooooooooo',grupoNumero);

    // Carga todas los grupos de la BD en la lista "grupos existentes" 
    useEffect(() =>{
        axios.get(`http://localhost:3001/gruposXFecha?fechaInicio=${fechaInicio}&fechaFinal=${fechaFinal}&grupo_id=${grupo_id}&idcurso=${idcurso}`)
        .then(response =>{
            setGruposExistentes(response.data);
        })
        .catch(error => {
            console.log('ERROR: Carga Fallida de grupos', error);
        });
    }, []);

    useEffect(() => {
        // Este se ejecuta cuando gruposexistentes cambie
        console.log('grupos existentes: ', gruposExistentes);
    }, [gruposExistentes]);


    useEffect(() =>{
        axios.get('http://localhost:3001/fusiones')
        .then(response =>{
            setFusiones(response.data);
        })
        .catch(error => {
            console.log('ERROR: Carga Fallida de fusiones', error);
        });
    }, [])

    useEffect(() => {
        // Este se ejecuta cuando gruposexistentes cambie
        console.log('fusiones existentes: ', fusiones);
    }, [fusiones]);

    const handleCheckboxChange = (index) => {
        if (grupoSeleccionado === index) {
        setGrupoSeleccionado(null);
        setGrupo(""); // Limpiar el estado grupo
        } else {
        setGrupoSeleccionado(index);
        setidgrupoXcurso(gruposExistentes[index].idgrupoXcurso);
        console.log('ver idgrupoXcurso1', idgrupoXcurso1);
        console.log('ver idgrupoXcurso2', idgrupoXcurso);
        }
    };


    const handleContinuar = () => {
        // Suponiendo que tienes un array de objetos 'a' que quieres buscar
        const resultado = fusiones.find(a => 
            (idgrupoXcurso1 === a.idgrupoXcurso1 && idgrupoXcurso === a.idgrupoXcurso2) ||
            (idgrupoXcurso === a.idgrupoXcurso1 && idgrupoXcurso1 === a.idgrupoXcurso2)
        );

        if (resultado) {
            alert("Estos grupos YA se encuentran fusionados.");
        } 
        else if(idgrupoXcurso === ""){
            alert("No ha seleccionado un grupo, por favor intentelo de nuevo.");
        }
        else {
            alert( `Fusion: ${idgrupoXcurso1} - ${idgrupoXcurso}`);
             // Enviar los datos del nuevo grupo al servidor
             axios.post('http://localhost:3001/fusion', {idgrupoXcurso1,idgrupoXcurso })
             .then(response => {
                 const { idFusionResult } = response.data;
                 navigate('/SeleccionaAño', {});
             })
             .catch(error => {
                 console.log('ERROR: No se pudo agregar el nuevo grupo', error);
                 alert('Error al crear un nuevo grupo');
             });
            navigate('/AgregarCursos',{state:{idGrupo: idGrupo, numero: grupo, horario: horario}});
        }
    };

    const handleBack = () =>{
        navigate('/Opciones',{state:{grupoNumero: grupoNumero, cursoNombre: cursoNombre, fechaInicio: fechaInicio, 
            fechaFinal: fechaFinal, añoPlanificador: añoPlanificador}});
    };


    return (
        <div>
        <Navbar />
        <div className="container d-flex flex-column align-items-center justify-content-center vh-100">
            <div className="card m-4 text-center" style={{ width: '800px' }}>
            <div className="card-header">
                <h2>
                    Fusionar el curso <span style={{ fontWeight: 'bold', color: 'blue' }}>{cursoNombre}</span> del Grupo <span style={{ fontWeight: 'bold', color: 'blue' }}>{grupoNumero}</span> con:
                </h2>
            </div>
            <div className="card-body">
                <div className="m-3">
                <label>Selecciona un grupo existente:</label>
                <div className="table-responsive" style={{ maxHeight: '200px' }}>
                    <table className="table">
                        <thead>
                        <tr>
                            <th>Grupo</th>
                            <th>Seleccionar</th>
                        </tr>
                        </thead>
                        <tbody>
                        {gruposExistentes.map((grupoExistente, index) => (
                            <tr key={index}>
                            <td>Grupo {grupoExistente.grupoNumero}</td>
                            <td>
                                <input
                                type="checkbox"
                                checked={grupoSeleccionado === index}
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
                <button className="btn btn-danger m-4" onClick={handleBack}>Volver</button>
                <button className="btn btn-primary m-4" onClick={handleContinuar}>
                    Continuar
                </button>
                </div>
            </div>
            </div>
        </div>
        </div>
    );
}

export default Fusionar_Grupo;