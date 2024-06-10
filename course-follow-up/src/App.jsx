import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider } from './components/pages/website/user_context';
import Login from './components/pages/website/login'
import Register from './components/pages/website/register'
import MainPage from './components/pages/client/main_page';
import Agregar_Planificador from './components/pages/client/Agregar/agregar_planificador';
import Agregar_Grupo from './components/pages/client/Agregar/agregar_grupo';
import Crear_Grupo from './components/pages/client/Agregar/crear_grupo';
import Agregar_Cursos from './components/pages/client/Agregar/agregar_cursos';
import Agregar_Cursos_Indiv from './components/pages/client/Agregar/agregar_cursos_indiv';
import App1 from './components/pages/client/Ver/templatePlanificador';
import Ver_Planificador from './components/pages/client/Ver/ver_planificador';
import Intercambiar_Cursos from './components/pages/client/Modificar/intercambiar_cursos';
import Opciones from './components/pages/client/Ver/opciones';
import Fusionar_Grupo from './components/pages/client/Ver/fusionarGrupo';
import Modificar_Curso from './components/pages/client/Ver/modificarCurso';
import MiCuenta from './components/pages/client/Cuenta/mi_cuenta';
import EditarCuenta from './components/pages/client/Cuenta/edlitar_cuenta';
import GestionarAdministradores from './components/pages/client/Cuenta/gestionar_administradores';
import './App.css'

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />}/>
          <Route path="/Register" element={<Register />}/>
          <Route path="/MainPage" element={<MainPage />}/>
          <Route path="/AgregarPlanificador" element={<Agregar_Planificador />}/>
          <Route path="/AgregarGrupo" element={<Agregar_Grupo />}/>
          <Route path="/CrearGrupo" element={<Crear_Grupo />}/>
          <Route path="/AgregarCursos" element={<Agregar_Cursos />}/>
          <Route path="/AgregarCursoIndividual" element={<Agregar_Cursos_Indiv />}/>
          <Route path="/SeleccionaAño" element={<Ver_Planificador />}/>
          <Route path="/App" element={<App1 />}/>
          <Route path="/Opciones" element={<Opciones />}/>
          <Route path="/FusionarGrupo" element={<Fusionar_Grupo />}/>
          <Route path="*" element={<Navigate to="/" />} />
          <Route path="/IntercambiarCursos" element={<Intercambiar_Cursos />}/>
          <Route path="/ModificarCursos" element={<Modificar_Curso />}/>
          <Route path="/MiCuenta" element={<MiCuenta />}/>
          <Route path="/EditarCuenta" element={<EditarCuenta />}/>
          <Route path="/GestionarAdministradores" element={<GestionarAdministradores />}/>
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App