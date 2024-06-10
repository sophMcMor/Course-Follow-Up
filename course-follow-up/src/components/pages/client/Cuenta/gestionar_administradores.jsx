import Navbar from "../../shared/navbar";
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

function GestionarAdministradores () {
    const navigate = useNavigate();
    const [usuarios, setUsuarios] = useState([]);
    const [userSelected, setUserSelected] = useState(null);
    const [idUsuario, setIdUsuario] = useState('');
    const [permisos, setPermisos] = useState(false);
    const [deshabilitar, setDeshabilitar] = useState(false);

    // Carga todos los usuarios
    useEffect(() =>{
        axios.get('http://localhost:3001/usuarios')
        .then(response =>{
            setUsuarios(response.data);
        })
        .catch(error => {
            console.log('ERROR: Carga Fallida de usuarios', error);
        });
    }, []);
    
    useEffect(() => {
        // Este se ejecuta cuando usuarios cambie
        console.log('usuarios:', usuarios[0]);
    }, [usuarios]);


    const handleBack = () =>{
        navigate('/MiCuenta');
    };

    const handleCheckboxChangeUser = (index) => {
        if (userSelected === index) {
            setUserSelected(null);
            setIdUsuario(""); // Limpiar el estado usuario
        } else {
            setUserSelected(index);
            //console.log('Revisar aquí: ', usuarios[index].idusuario);
            setIdUsuario(usuarios[index].idusuario); // Establecer el id del usuario seleccionado
        }
    };

    const handleCheckboxChangePermisos = () => {
        setPermisos(!permisos);
        if (!permisos) setDeshabilitar(false); // Desmarcar deshabilitar si permisos se selecciona
    };

    const handleCheckboxChangeDeshabilitar = () => {
        setDeshabilitar(!deshabilitar);
        if (!deshabilitar) setPermisos(false); // Desmarcar permisos si deshabilitar se selecciona
    };

    const handleConfirm = () => {
        if (permisos && deshabilitar) {
            alert('Solo puede seleccionar uno: Permisos Administrador o Deshabilitar.');
            return;
        }
        if (!permisos && !deshabilitar) {
            alert('Debe seleccionar al menos uno: Permisos Administrador o Deshabilitar.');
            return;
        }

        if(userSelected == null){
            alert('Debe seleccionar a un usuario para poder realizar alguna interacción de permisos')
        }

        const adminValue = permisos ? 1 : 0;
        alert('IdUsuario: ', idUsuario);
        axios.put(`http://localhost:3001/editarUsuario/${idUsuario}`, { admin: adminValue })
            .then(response => {
                console.log('Permisos actualizados:', response.data);
                // Aquí puedes actualizar el estado o mostrar un mensaje de éxito
            })
            .catch(error => {
                console.log('ERROR: Actualización de permisos fallida', error);
            });
            
    };

    return(
        <div>
            <Navbar/>           
            <div style={{ marginTop: '100px'}}>
                <h1 style={{ color: 'white'}} >Gestionar Administradores</h1>

                <div className="d-flex align-items-center">

                    <button className="btn btn-back" 
                        style={ { marginTop: '15px', marginLeft: '10px'}}
                        onClick={handleBack}>Volver
                    </button>
                </div>

                <div className="container">
                    <div className="left">
                        <ul className="user-list">
                            {usuarios.map((user, index) => (
                                <li key={index} className="user-item">
                                    <div className="container">
                                        <div>
                                            <h5>{user.nombre} {user.apellidos}</h5>
                                            <p>{user.correo}</p>
                                            <p>{user.admin.data[0] === 1 ? 'Administrador' : 'Sin permisos Administrador'}</p>
                                        </div>
                                        <div>
                                            <input type="checkbox"
                                                className="custom-checkbox"
                                                checked={userSelected === index}
                                                onChange={() => handleCheckboxChangeUser(index)}
                                            ></input>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="right">
                        <h2>Indicar permisos: </h2>
                        <div className="actions">
                            <div>
                                <input type="checkbox" id="checkbox1" checked={permisos} onChange={handleCheckboxChangePermisos}/>
                                <label htmlFor="checkbox1">Permisos Administrador</label>
                            </div>
                            <div>
                                <input type="checkbox" id="checkbox2" checked={deshabilitar} onChange={handleCheckboxChangeDeshabilitar}/>
                                <label htmlFor="checkbox2">Deshabilitar permisos</label>
                            </div>
                            <div>
                                <button className="btn btn-primary" style={{ width: '190px'}} onClick={handleConfirm}>Confirmar cambios</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GestionarAdministradores;
