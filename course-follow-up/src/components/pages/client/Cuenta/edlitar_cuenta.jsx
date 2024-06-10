import Navbar from "../../shared/navbar";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { UserContext } from "../../website/user_context";
import axios from 'axios';

function EditarCuenta () {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const { idUsuario } = useContext(UserContext);
    const [usuario, setUsuarios] = useState({
        nombre: '',
        apellidos: '',
        correo: '',
        contraseña: ''
    });
    const [correo, setCorreo] = useState('');
    const [contraseña, setContraseña] = useState('');
    const [confirmContraseña, setConfirmContraseña] = useState('');

    // Carga el usuario que se encuentra en sesión
    useEffect(() =>{
        axios.get(`http://localhost:3001/usuario/${idUsuario}`)
        .then(response =>{
            setUsuarios(response.data);
            setCorreo(response.data.correo);
            setContraseña(response.data.contraseña);
            setConfirmContraseña(response.data.contraseña);

        })
        .catch(error => {
            console.log('ERROR: Carga Fallida de usuario', error);
        });
    }, [idUsuario]);
    
    useEffect(() => {
        // Este se ejecuta cuando usuario cambie
        console.log('usuario:', usuario[0]);
    }, [usuario]);


    const handleBack = () =>{
        navigate('/MiCuenta');
    };

    const handleEditar = () =>{
        if (contraseña !== confirmContraseña) {
            alert("Las contraseñas no coinciden");
            return;
        }

        const updatedUsuario = {
            correo,
            contraseña
        };

        axios.put(`http://localhost:3001/usuario/${idUsuario}`, updatedUsuario)
        .then(response => {
            console.log('Usuario actualizado', response.data);
            alert('Datos actualizados correctamente');
            navigate('/MiCuenta');
        })
        .catch(error => {
            console.log('ERROR: Actualización fallida', error);
        });
    }

    return(
        <div>
            <Navbar/>           
        <div style={{ marginTop: '80px'}}>
            <h1 style={{ color: 'white'}} >Editar Cuenta</h1>
            <div className="card m-4 p-4" style={{ textAlign: 'center', width: '600px'}}>
                <div className="form-group">
                    <br/>
                    <label style={{ fontSize: 'larger'}}>Dirección de correo: </label>
                        <input 
                            type= 'text'
                            className="form-control m-2" 
                            value={correo}
                            onChange={(e) => setCorreo(e.target.value)}
                        />
                </div>

                <div className="form-group">
                            <br/>
                            <label style={{ fontSize: 'larger'}}>Contraseña: </label>
                            <input 
                                type= {showPassword ? "text" : "password"} 
                                className="form-control m-2" 
                                value={contraseña}
                                onChange={(e) => setContraseña(e.target.value)}
                            />
                            <button 
                                type="button" 
                                className="btn position-absolute end-0 top-50 translate-middle-y"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{ marginRight: "15px", marginTop: '25px' }}
                            >
                                <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
                            </button>
                </div>

                <div className="form-group">
                            <br/>
                            <label style={{ fontSize: 'larger'}}>Confirmar Contraseña: </label>
                            <input 
                                type= {showPassword ? "text" : "password"} 
                                className="form-control m-2" 
                                value={confirmContraseña}
                                onChange={(e) => setConfirmContraseña(e.target.value)}
                            />
                            <button 
                                type="button" 
                                className="btn position-absolute end-0 top-50 translate-middle-y"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{ marginRight: "15px", marginTop: '133px' }}
                            >
                                <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
                            </button>
                </div>
            </div>
            
            <div  style={{ textAlign: 'center' }}>
                <button className="btn btn-primary" onClick={handleEditar}>Confirmar Cambios</button>
                <br />
                <button className="btn btn-back" onClick={handleBack}>Volver</button>
            </div>
           
        </div>

    </div>
    );
}

export default EditarCuenta;