import Navbar from "../../shared/navbar";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from 'axios';

function Agregar_Grupo() {
    const navigate = useNavigate();
    
    const [gruposExistentes, setGruposExistentes] = useState([]);
    const [grupoSeleccionado, setGrupoSeleccionado] = useState(null);
    const [idGrupo, setIdGrupo] = useState("");
    const [grupo, setGrupo] = useState("");
    const [horario, setHorario] = useState("");

    // Carga todas los grupos de la BD en la lista "grupos existentes" 
    useEffect(() =>{
        axios.get('http://localhost:3001/grupos')
        .then(response =>{
            setGruposExistentes(response.data);
        })
        .catch(error => {
            console.log('ERROR: Carga Fallida de grupos', error);
        });
    }, []);

    useEffect(() => {
        // Este se ejecuta cuando gruposexistentes cambie
        //console.log('grupos existentes: ', gruposExistentes[0]);
    }, [gruposExistentes]);

    const handleCheckboxChange = (index) => {
        if (grupoSeleccionado === index) {
        setGrupoSeleccionado(null);
        setGrupo(""); // Limpiar el estado grupo
        } else {
        setGrupoSeleccionado(index);
        setIdGrupo(gruposExistentes[index].idgrupo); // Establecer el id del grupo seleccionado
        setGrupo(gruposExistentes[index].numero);
        setHorario(gruposExistentes[index].horario); // Establecer el horario del grupo seleccionado
        }
    };

    const handleCrearGrupo = () =>{
        navigate('/CrearGrupo', {});
    };

    const handleContinuar = () => {
        if (grupo === "") {
            alert("No ha seleccionadoun grupo, por favor intentelo de nuevo.");
        } 
        else {
            //alert( `Grupo seleccionado: ${grupo} y horario: ${horario}`);
            navigate('/AgregarCursos',{state:{idGrupo: idGrupo, numero: grupo, horario: horario}});
        }
    };

    const handleBack = () =>{
        navigate('/MainPage',{});
    };


    return (
        <div>
        <Navbar />
        <div className="container d-flex flex-column align-items-center justify-content-center vh-100">
            <div className="card m-4 text-center" style={{ width: '800px' }}>
            <div className="card-header">
                <h2>Agrega o Selecciona un Grupo</h2>
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
                            <td>Grupo {grupoExistente.numero}</td>
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
                <div className="form-group d-flex align-items-center">
                    <button className="btn btn-success m-4" onClick={handleCrearGrupo}>Crear un Grupo Nuevo</button>
                </div>
                <div className="m-3">
                <hr />
                <button className="btn btn-back m-4" onClick={handleBack}>Volver</button>
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

export default Agregar_Grupo;