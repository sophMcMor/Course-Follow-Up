import Navbar from "../shared/navbar";
import { useNavigate} from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";

function MainPage () {
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const adminStatus = sessionStorage.getItem('isAdmin') === '1';
        setIsAdmin(adminStatus);
    }, []);

    const handleAgregar = () => {
        if (isAdmin) {
            navigate('/AgregarGrupo');
        }
    };

    const handleVer = () => {
        navigate('/SeleccionaAño',{});
    };

    return(
        <div>
            <Navbar/>
            <div className="container d-flex flex-column align-items-center justify-content-center vh-100">
                <h1 className="mb-4" style={{ color: 'white'}}>Course Follow-Up</h1>
                <div className="card m-4 text-center" style={{ width: '500px'}}>
                    <div className="card-header">
                        <h2>Bienvenido/a</h2>
                    </div>
                    <div className="card-body">
                        <div className="m-3">
                            <button className="btn btn-primary btn-lg" onClick={handleAgregar} disabled={!isAdmin}>Agregar Planificador</button>
                        </div>
                        <div className="m-3">
                            <button className="btn btn-primary btn-lg" onClick={handleVer}>Ver Planificador</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MainPage;