import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../shared/navbar";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import generarRandomPassword from "./generarPassword";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { UserContext } from "./user_context";



function Login () {
    const navigate = useNavigate();
    const { setIdUsuario } = useContext(UserContext);

    //Datos de Login
    const [usuarios, setUsuarios] = useState([]);
    const [correo, setCorreo] = useState('');
    const [psswrd, setPsswrd] = useState('');
    const [showError, setShowError] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Carga todas las actas de la BD en la lista "actas"
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
        // Este se ejecuta cuando actas cambie
        console.log('usuarios actualizados:', usuarios[0]);
        //console.log('keywords: ', actas[0].palabras_clave)
    }, [usuarios]);

    const actualizarUsuarios = () =>{
        console.log("CAMBIO CONTRASEÑA");
        axios.get('http://localhost:3001/usuarios')
        .then(response =>{
            setUsuarios(response.data);
        })
        .catch(error => {
            console.log('ERROR: Carga Fallida de usuarios', error);
        });
    }

    const validarFormatoCorreo = (correo) => {
        const regex = /@(estudiantec\.cr|itcr\.ac\.cr)$/i;
        return regex.test(correo);
    };


    const handleLogin = () =>{
        console.log('aqui: ', usuarios[0].admin.data[0]);
        console.log(correo);
        console.log(psswrd);

        if(!correo || !psswrd){
            setShowError(true);
        } else if(!validarFormatoCorreo(correo)){
            setShowError(true)
        }
        else{
            const usuarioEncontrado = usuarios.find(usuario => usuario.correo === correo && usuario.contraseña === psswrd);

            if (usuarioEncontrado) {
                sessionStorage.setItem('usuarioActual', correo);
                sessionStorage.setItem('isAdmin', usuarioEncontrado.admin.data[0]); // Guardar el rol del usuario
                // El usuario y la contraseña coinciden
                setIdUsuario(usuarioEncontrado.idusuario);
                //alert(usuarioEncontrado.admin.data[0]);
                navigate('/MainPage',{});
                console.log("Inicio de sesión exitoso");
            } else {
                // No se encontró el usuario o la contraseña es incorrecta
                setShowError(true);
                console.log("Inicio de sesión fallido");
            }
        }
    };

    const handleChangePassword = async () => {
        if(!correo){
            toast.info('Debe ingresar su dirección de correo.');
        } else if(!validarFormatoCorreo(correo)){
            toast.error('Formato de correo inválido.');
        }else{
            const correoEncontrado = usuarios.find(usuario => usuario.correo === correo);

            if(correoEncontrado){
                const nuevaPassword = generarRandomPassword(8);

                try {
                    // Actualizar la contraseña en la base de datos
                    await axios.put('http://localhost:3001/usuarios/updatePassword', {
                        correo: correo,
                        nuevaContraseña: nuevaPassword
                    });

                    // Enviar correo con la nueva contraseña
                    await axios.post('http://localhost:3001/sendEmail', {
                      to: correo,
                      subject: '🚨 Recuperación de Contraseña 🚨',
                      body: `¡Hola! Le saluda Course Follow Up 😊\n\nSu nueva contraseña es: ${nuevaPassword}` 
                    });
                    
                    // Actualizar lista de usuarios
                    actualizarUsuarios();

                    toast.success('Se ha enviado un correo a su cuenta');

                  } catch (error) {
                    toast.error('Error al enviar correo', error);
                  }
            }else{
                toast.error('Correo inválido.');
            }
        }
    };
/**
 * 
 *         
 * <div 
        style={{ 
            background: 'linear-gradient(to bottom, orange, blue)', // Degradado de naranja a azul
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            minHeight: '100vh', // Ajusta el tamaño mínimo según sea necesario
        }}>  
 */
    return (
        <div>            
        <Navbar/>
            <div className="container d-flex flex-column align-items-center justify-content-center vh-100">
                <h1 className="mb-4" style={{ color: 'white'}}>Course Follow-Up</h1>
                <div className="card m-4 text-center" style={{ width: '500px'}}>
                    <div className="card-header">
                        <h2>Login</h2>
                    </div>
                    <div className="card-body">
                        <div className="form-group">
                            <br/>
                            <label>Dirección de correo electrónico:</label>
                            <input 
                                type="text" 
                                className="form-control m-2" 
                                placeholder="Ej: juanperez@estudiantec.cr / @itcr.ac.cr" 
                                onChange={(event)=>{setCorreo(event.target.value)}}
                            />
                        </div>
                        <div className="form-group">
                            <br/>
                            <label>Contraseña:</label>
                            <input 
                                type= {showPassword ? "text" : "password"} 
                                className="form-control m-2" 
                                onChange={(event)=>{setPsswrd(event.target.value)}}
                            />
                            <button 
                                type="button" 
                                className="btn position-absolute end-0 top-50 translate-middle-y"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{ marginRight: "15px", marginTop: '10px' }}
                            >
                                <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
                            </button>
                        </div>
                        <div className="m-3">
                            <button className="btn btn-primary" onClick={handleLogin}>Iniciar Sesión</button>
                            <hr />
                        </div>
                            <Link onClick={handleChangePassword}><span className="text-primary">¿Olvidaste la contraseña?</span></Link>
                             <ToastContainer position="top-center"/>
                            <br />
                            <Link to="/Register"><span className="text-primary">¿No tienes cuenta?</span></Link>
                    </div>
                </div>
                {showError && (
                    <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Error de Inicio de Sesión</h5>
                                    <button type="button" className="btn-close" onClick={() => setShowError(false)}></button>
                                </div>
                                <div className="modal-body">
                                    Los datos ingresados son inválidos o están vacíos. Por favor, completa todos los campos correctamente.
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowError(false)}>Cerrar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Login;