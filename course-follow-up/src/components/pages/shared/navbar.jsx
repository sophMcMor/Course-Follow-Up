import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faUser } from '@fortawesome/free-solid-svg-icons'; 
import logo from '../../assets/tecnico.png'
import tecLogo from '../../assets/tec.png'

function DropdownMenu() {
    const navigate = useNavigate();

    const menuStyle = {
        position: 'absolute',
        top: '100%',
        right: 0,
        backgroundColor: '#092D4E',
        border: '1px solid #ccc',
        borderRadius: '8px',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
        padding: '10px',
    };

    const menuItemStyle = {
        display: 'block',
        padding: '10px 25px',
        color: '#FFFFFF' 
    };

    const handleItemCerrar= (e) => {
        sessionStorage.removeItem('usuarioActual');
        navigate('/');
    };

    const handleItemCuenta= (e) => {
        //sessionStorage.setItem('miCuenta', 'open');
        navigate('/MiCuenta');
    };

    return (
        <div style={menuStyle}>
            <a style={menuItemStyle} href="#" onClick={handleItemCuenta}>Ver Cuenta</a>
            <a style={menuItemStyle} href="#" onClick={handleItemCerrar}>Cerrar Sesión</a>
        </div>
    );
}


function Navbar () {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [usuarioActual, setUsuarioActual] = useState('');
    //const [miCuentaActiva, setmiCuentaActiva] = useState('');

    // Al cargar el componente y cada vez que usuarioActual cambie, verifica si hay un usuario actual en la sesión
    useEffect(() => {
        const usuario = sessionStorage.getItem('usuarioActual');
        console.log("ACTUAL", usuario);
        setUsuarioActual(usuario);
    }, [usuarioActual]);
    

    const handleToggleDropdown = () => {
        console.log("ESTADO", dropdownOpen);
        setDropdownOpen(!dropdownOpen); // Cambia el estado para mostrar u ocultar el menú desplegable
    };


    return(
        <nav style={{ backgroundColor: '#092D4E' }} className="navbar navbar-expand-lg navbar-dark fixed-top">
            <div className="container-fluid">
                <div className="navbar-brand d-flex align-items-center">
                <img src={logo} alt="Logo" height="70" width="150" className="mr-3" />
                </div>
                <div className="ml-auto d-flex align-items-center">
                    {(usuarioActual && (
                        <div className="position-relative">
                            <FontAwesomeIcon icon={faUser} style={{ color: 'white', fontSize: '40px', cursor: 'pointer' }} onClick={handleToggleDropdown} />
                            {dropdownOpen && <DropdownMenu />}
                        </div>
                    ))}

                    <img src={tecLogo} alt="TEC_Logo" height="50" width="220" className="mr-3" />
                </div>
            </div>
        </nav>
    );
}

export default Navbar;