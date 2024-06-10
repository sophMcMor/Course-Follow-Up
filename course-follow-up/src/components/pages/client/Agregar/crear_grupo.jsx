import Navbar from "../../shared/navbar";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from 'axios';

function Crear_Grupo() {
    const navigate = useNavigate();
    const [gruposExistentes, setGruposExistentes] = useState([]);
    const [nuevoGrupo, setNuevoGrupo] = useState("");
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

    const handleContinuar = async() => {
        const grupoExistente = gruposExistentes.find(grupo => grupo.numero === nuevoGrupo);
        if(grupoExistente){
            alert("Este grupo ya existe, por favor intentelo con otro número.")
        }
        else if (nuevoGrupo === "" || horario ==="") {
            alert("Datos vacíos, por favor intentelo de nuevo.");
        } 
        else {

            // Enviar los datos del nuevo grupo al servidor
            axios.post('http://localhost:3001/grupos', { numero: nuevoGrupo, horario })
            .then(response => {
                //console.log('VER AQUI 1: ', response.data);
                const { idGrupoResult } = response.data;
                //console.log('VER AQUI 2: ', idGrupoResult[0][0].idGrupo);
                const idGrupo = idGrupoResult[0][0].idGrupo
                //console.log('VER AQUI 3: ', idGrupo);
                //alert(`Nuevo grupo creado con ID: ${idGrupo}`);
                //alert( `Grupo creado: ${nuevoGrupo} y Horario ${horario}`);
                navigate('/AgregarCursos', {state:{idGrupo: idGrupo , numero: nuevoGrupo, horario: horario}});
            })
            .catch(error => {
                console.log('ERROR: No se pudo agregar el nuevo grupo', error);
                alert('Error al crear un nuevo grupo');
            });
        }
    };

    const handleBack = () =>{
        navigate('/AgregarGrupo',{});
    };


    return (
        <div>
        <Navbar />
        <div className="container d-flex flex-column align-items-center justify-content-center vh-100">
            <div className="card m-4 text-center" style={{ width: '800px' }}>
            <div className="card-header">
                <h2>Crear un Grupo Nuevo</h2>
            </div>
            <div className="card-body">
                <div className="form-group d-flex align-items-center">
                <label className="me-2">Crea un nuevo  grupo:</label>
                <input 
                    type="text" 
                    className="form-control m-2" 
                    style={{ width: '200px' }} 
                    maxLength="3" 
                    onChange={(e) => {
                        let inputValue = e.target.value.trim(); // Eliminar espacios en blanco al principio y al final
                        inputValue = inputValue.slice(0, 3); // Limitar a 3 caracteres
                        inputValue = inputValue.replace(/[^\d-]/g, ''); // Eliminar cualquier carácter que no sea un dígito o un signo de menos
                        if (inputValue === "" || inputValue < 1) {
                            setNuevoGrupo(""); // Establecer el estado como vacío si la entrada no es válida
                        } else {
                            setNuevoGrupo(parseInt(inputValue)); // Establecer el estado con el valor válido convertido a entero
                        }
                    }} 
                    placeholder="Digite el número"
                />

                </div>
                <div className="form-group d-flex align-items-center">
                    <label className="me-2">Selecciona un horario:</label>
                    <select
                        className="form-control m-2"
                        style={{ width: '200px' }}
                        value={horario}
                        onChange={(e) => setHorario(e.target.value)}
                    >
                        <option value="">Seleccione un horario</option>
                        <option value="L-M">L-M</option>
                        <option value="K-J">K-J</option>
                    </select>
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

export default Crear_Grupo;