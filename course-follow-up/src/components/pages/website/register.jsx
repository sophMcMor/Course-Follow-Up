// Importación de librerías
import React, { useEffect, useContext, useState } from "react";
import { useNavigate} from "react-router-dom";
import Navbar from "../shared/navbar";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { UserContext } from "./user_context";


function Signup () {
    // Declaración de variable para navegar entre páginas
    const navigate = useNavigate();
    const { setIdUsuario } = useContext(UserContext);

    //Datos de Registro
    const [usuarios, setUsuarios] = useState([]);
    const [name, setName] = useState("");
    const [lastName, setLastName] = useState("");
    const [correo, setCorreo] = useState("");
    const [psswrd, setPsswrd] = useState("");
    const [confirmPsswrd, setconfirmPsswrd] = useState("");
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
    }, [usuarios]);
    
    // Función para devolverse al login
    const handleBack = () => {
        navigate('/',{});
    }

    // Función para validar el formato de la contraseña
    const validarPassword = (password) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$#(=?+}{\]\[]).{8,}$/;
        return regex.test(password);
    };

    // Función para validar el largo de los inputs
    const validarInput = (input) => {
        return input.length >= 4;
    };
    
    // Función para validar el formato del correo
    const validarFormatoCorreo = (correo) => {
        const regex = /@(estudiantec\.cr|itcr\.ac\.cr)$/i;
        return regex.test(correo);
    };
    
    // Función para realizar el registro
    const handleRegister = async () => {
        const usuarioEncontrado = usuarios.find(usuario => usuario.correo === correo);

        if(!name || !lastName || !correo || !psswrd || !confirmPsswrd){
            setShowError(true);
        }
        else if (usuarioEncontrado) {
            //Ya existe un usuario con este correo
            setShowError(true);
            console.log("Registro fallido");
        }
        else if(psswrd !== confirmPsswrd){
            setShowError(true);
        console.log("Contraseñas incorrectas");
        }
        else if (!validarPassword(psswrd)) {
            toast.error("La contraseña debe tener mínimo 8 caracteres y al menos una mayúscula, minúscula, número y carácter especial como #$(=)?+}{][");
        } else if (!validarInput(name) || !validarInput(lastName)){
            setShowError(true);
            console.log("Minimo de caracteres");
        }else if(!validarFormatoCorreo(correo)){
            setShowError(true);
            console.log("Correo inválido.")
        }
        else{
            const datos = {
                name,
                lastName,
                correo,
                psswrd
            };
    
            try{
                const response = await axios.post('http://localhost:3001/usuarios', datos);
                console.log(response.data);

                // Enviar correo de confirmacion de registro
                await axios.post('http://localhost:3001/sendEmail', {
                    to: correo,
                    subject: '📝¡Bienvenido a COURSE FOLLOW UP! 📝',
                    body: `¡Hola! 😊 Su cuenta ha sido creada con éxito.\n\nSu usuario es: ${correo}\nSu contraseña es: ${psswrd}` 
                });
                
                toast.success('Usuario registrado exitosamente.');
                sessionStorage.setItem('usuarioActual', correo);
                //setIdUsuario(usuarioEncontrado.idusuario);
                navigate('/MainPage',{});
            }
            catch(err){
                alert("Error al subir el usuario: ", err);
            }
        }
    };

    return(
        <div>
            <div className="mb-5">
                <Navbar/>
            </div>
            <div className="container d-flex flex-column align-items-center justify-content-center mt-5 vh-auto">
                <h1 className="mb-2" style={ { marginTop: "80px", color: 'white'}}>Course Follow-Up</h1>
                <div className="card m-4 text-center" style={{ width: '500px', overflowY: 'auto'}}>
                    <div className="card-header">
                        <h2>Crear Cuenta</h2>
                    </div>
                    <div className="card-body">
                        <div className="form-group">
                            <label>Nombre:</label>
                            <input 
                                type="text" 
                                maxLength="24" 
                                className="form-control m-2" 
                                onChange={(event)=>{setName(event.target.value)}}
                            />
                        </div>
                        <div className="form-group">
                            <label>Apellido:</label>
                            <input 
                                type="text" 
                                maxLength="32" 
                                className="form-control m-2" 
                                onChange={(event)=>{setLastName(event.target.value)}}
                            />
                        </div>
                        <div className="form-group">
                            <label>Dirección de correo electrónico:</label>
                            <input 
                                type="text" 
                                className="form-control m-2"  
                                placeholder="Ej: juanperez@estudiantec.cr / @itcr.ac.cr"
                                onChange={(event)=>{setCorreo(event.target.value)}}
                            />
                        </div>
                        <div className="form-group">
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
                                style={{ marginRight: "15px", marginTop: '46px'}}
                            >
                                <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
                            </button>
                        </div>
                        <div className="form-group">
                            <label>Confirmar Contraseña:</label>
                            <input 
                                type= {showPassword ? "text" : "password"} 
                                className="form-control m-2"
                                onChange={(event)=>{setconfirmPsswrd(event.target.value)}}
                            />
                            <button 
                                type="button" 
                                className="btn position-absolute end-0 top-50 translate-middle-y"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{ marginRight: "15px", marginTop:'125px'}}
                            >
                                <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
                            </button>
                        </div>
                        <div className="m-3">
                            <hr />
                            <button className="btn btn-back m-4" onClick={handleBack}>Volver</button>
                            <button className="btn btn-primary m-4" onClick={handleRegister}>Registrarse</button>
                            <ToastContainer position="top-center"/>
                        </div>
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

export default Signup;