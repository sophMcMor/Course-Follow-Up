import Navbar from "../../shared/navbar";
import React, { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../website/user_context";
import axios from 'axios';

function MiCuenta () {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const { idUsuario } = useContext(UserContext);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const adminStatus = sessionStorage.getItem('isAdmin') === '1';
        setIsAdmin(adminStatus);
    }, []);

    console.log('ID USUARIO: ', idUsuario);

    const [usuario, setUsuarios] = useState({
        nombre: '',
        apellidos: '',
        correo: '',
        contraseña: ''
    });

    // Carga todas las actas de la BD en la lista "actas"
    useEffect(() =>{
        axios.get(`http://localhost:3001/usuario/${idUsuario}`)
        .then(response =>{
            setUsuarios(response.data);

        })
        .catch(error => {
            console.log('ERROR: Carga Fallida de usuario', error);
        });
    }, [idUsuario]);
    
    useEffect(() => {
        // Este se ejecuta cuando actas cambie
        console.log('usuario:', usuario[0]);
        //console.log('keywords: ', actas[0].palabras_clave)
    }, [usuario]);

    //const usuarioEncontrado = usuario.find(usuario => usuario.idusuario === idUsuario);

    const handleBack = () =>{
        //sessionStorage.setItem('miCuenta', 'close') 
        navigate('/MainPage');
    };

    const handleEdit = () => {
        navigate('/EditarCuenta');
    };

    const handleAccount = () => {
        if (isAdmin) {
            navigate('/GestionarAdministradores');
        }
    };

    return(
        <div>
            <Navbar/>           
        <div style={{ marginTop: '80px'}}>
            <h1 style={{ color: 'white'}} >Mi Cuenta</h1>
            
            <div className="card m-4 p-4" style={{ textAlign: 'left'}}>
                <div className="form-group">
                    <br/>
                    <h5 style={{ display: 'inline'}}>Nombre: </h5>
                    <label style={{ display: 'inline', fontSize: 'larger'}}> {usuario.nombre}</label>
                </div>
                
                <div className="form-group">
                    <br/>
                    <h5 style={{ display: 'inline'}}>Apellido: </h5>
                    <label style={{ display: 'inline', fontSize: 'larger'}}> {usuario.apellidos}</label>
                </div>
                
                <div className="form-group">
                    <br/>
                    <h5 style={{ display: 'inline'}}>Dirección de correo: </h5>
                    <label style={{ display: 'inline', fontSize: 'larger'}}> {usuario.correo}</label>
                </div>
                
                <div className="form-group">
                    <br/>
                    <h5 >Contraseña: </h5>
                    <input
                        type= {showPassword ? "text" : "password"} 
                        className="form-control m-2" 
                        value= {usuario.contraseña}
                        readOnly
                    />
                    <button 
                        type="button" 
                        className="btn position-absolute end-0 top-50 translate-middle-y"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ marginRight: "15px", marginTop: '70px' }}
                        >
                            <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
                    </button>
                </div>

                <div style={{ textAlign: 'right'}}>
                    <br/>
                    <button className="btn-link" style={{ backgroundColor: '#092D4E'}} onClick={handleEdit}>
                        <FontAwesomeIcon icon={faEdit} className="mr-2" />
                    </button>
                </div>
            </div>
            
            <div  style={{ textAlign: 'center' }}>
                <button className="btn btn-primary" onClick={handleAccount} disabled={!isAdmin}>Gestionar Administradores</button>
                <br />
                <button className="btn btn-back" onClick={handleBack}>Volver</button>
            </div>
           
        </div>

    </div>
    );
}

export default MiCuenta;