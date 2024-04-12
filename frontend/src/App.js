import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Profile from './components/Profile';
import Client from './pages/Client';
import Etablissement from './pages/etablissements';
import Agences from './pages/agence';
import BlackList from './pages/BlackList';
import CreerCompte from './pages/creerComptes';
import EtabAgence from './pages/etablissementAgence';
import ClientEntrep from './pages/ClientEntrep';
import ClientTech from './pages/ClientTechnicien';
import CoupureTech from './pages/CoupuresTechnicien';
import RetablissementTech from './pages/RetablissementsTechnicien';
import Technicien from './pages/Technicien';
import Login from './pages/Login';
import Password from './pages/Password';
import Navbar from './components/Navbar'
import AjoutTechnicien from './pages/ajoutTechnicien';
import { useAuthContext } from './hooks/useAuthContext';

import Footer from './components/Footer';

import './styles/navbar.css'
import './styles/forms.css'
import './styles/footer.css'

function App() {

  const { user } = useAuthContext()
  const userType = user?.userType


  return (
    <div className="App">
      <BrowserRouter>

    
        <Navbar />
        <div className='leftSide'>
        <Profile/>
        <div className='pages'>

          <Routes>
            <Route path='/Login' element={!user ? <Login /> : <Navigate to='/' />} />
            <Route path='/Logout' element={user ? <Login /> : <Navigate to='/' />} />
            <Route path='/' element={user ? <Home /> : <Navigate to="/Login" />} />
            <Route path='/passwordChange' element={user ? <Password /> : <Navigate to="/Login" />} />

            {/* partiADMIN */}

            <Route path='/agences' element={!user && userType !=='Admin' ? <Login /> : <Agences/>} />
            <Route path='/etablissements' element={!user &&  userType !=='Admin' ? <Login /> : <Etablissement/>} />
            <Route path='/creerCompte' element={!user  && userType !=='Admin' ? <Login /> : <CreerCompte/> } />
            {/* partieAgence */}
            <Route path='/entreprises/:id' element ={ !user && userType!=="CadreAgence" ? <Login/> : <EtabAgence/>} />
            <Route path='/clients/:id' element={!user && userType!=="CadreAgence" ? <Login/>  : <Client />} />
            <Route path='/BlackList/:id' element={!user && userType!=="CadreAgence" ? <Login/> :<BlackList/>} />
            {/* partieEntreprise */}
            <Route path='/listClientsEntreprise/:id' element={!user && userType !== 'responsableEntreprise' ? <Login />:<ClientEntrep/>} />
            <Route path='/listTechnicienEntreprise/:id' element={!user && userType !== 'responsableEntreprise' ?<Login />:<Technicien/>} />
            <Route path='/ajouterTechnicien/:id' element={!user && userType !== 'responsableEntreprise' ? <Login/>:<AjoutTechnicien/>}/>
            {/* partieTechnicien*/}
            <Route path='/listClientsTechnicien/:id' element={!user && userType !== 'technicien' ? <Login />:<ClientTech/>} />
            <Route path='/Coupures/:id' element={!user && userType !== 'technicien' ? <Login />:<CoupureTech/>} />
            <Route path='/Retablissements/:id' element={!user && userType !== 'technicien' ? <Login />:<RetablissementTech/>} />

          </Routes>

        </div>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;

