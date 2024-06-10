import Navbar from "../../shared/navbar";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from 'axios';

function Agregar_Planificador() {
    const navigate = useNavigate();
    
    
    //const planificadoresExistentes = ["Planificador 2021", "Planificador 2022", "Planificador 2023"];

    // Datos Planificador
    const [planificadoresExistentes, setPlanificadoresExistentes] = useState([]);
    const [planificadorSeleccionado, setPlanificadorSeleccionado] = useState(null);
    const [planificador, setPlanificador] = useState("");
    const [nuevoPlanificador, setNuevoPlanificador] = useState("");


    // Carga todas los planificadores de la BD en la lista "planificadores existentes" 
    useEffect(() =>{
        axios.get('http://localhost:3001/planificadores')
        .then(response =>{
            setPlanificadoresExistentes(response.data);
        })
        .catch(error => {
            console.log('ERROR: Carga Fallida de usuarios', error);
        });
    }, []);

    useEffect(() => {
        // Este se ejecuta cuando planificadoresExistentes1 cambie
        console.log('planificadores existentes: ', planificadoresExistentes[0]);
    }, [planificadoresExistentes]);

    const handleCheckboxChange = (index) => {
        if (planificadorSeleccionado === index) {
        setPlanificadorSeleccionado(null);
        setPlanificador(""); // Limpiar el estado planificador
        } else {
        setPlanificadorSeleccionado(index);
        setPlanificador(planificadoresExistentes[index].idplanificador); // Establecer el nombre del planificador seleccionado
        }
    };

    const handleContinuar = () => {
        if (planificador === "" && nuevoPlanificador === "") {
            alert("No ha seleccionado o creado un planificador, por favor intentelo de nuevo.");
        }
        else if(planificador != "" && nuevoPlanificador != ""){
            alert('No puede seleccionar y crear un planificador al mismo tiempo.')
        }
        else {
        alert( `Planificador seleccionado: ${planificador} o Planificador creado: ${nuevoPlanificador}`);
        //navigate('/AgregarGrupo',{});
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
                <h2>Agrega o Selecciona un Planificador</h2>
            </div>
            <div className="card-body">
                <div className="m-3">
                <label>Selecciona un planificador existente:</label>
                <div className="table-responsive" style={{ maxHeight: '200px' }}>
                    <table className="table">
                        <thead>
                        <tr>
                            <th>Planificador</th>
                            <th>Seleccionar</th>
                        </tr>
                        </thead>
                        <tbody>
                        {planificadoresExistentes.map((planificadorExistente, index) => (
                            <tr key={index}>
                            <td>{planificadorExistente.nombre}</td>
                            <td>
                                <input
                                type="checkbox"
                                checked={planificadorSeleccionado === index}
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
                <label className="me-2">Crea un nuevo Planificador:</label>
                <input 
                    type="number" 
                    className="form-control m-2" 
                    style={{ width: '200px' }} 
                    min="2024" 
                    onInput={(e) => {
                        const inputValue = parseInt(e.target.value);
                        if (isNaN(inputValue) || inputValue < 2024) {
                            setNuevoPlanificador(""); // Establecer el estado como vacío si la entrada no es válida
                        } else {
                            setNuevoPlanificador(inputValue.toString().slice(0, 4)); // Establecer el estado con el valor válido
                        }
                    }} 
                    placeholder="Seleccione el año" 
                />


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

export default Agregar_Planificador;