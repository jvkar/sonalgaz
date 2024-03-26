import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'

import Facture from './pages/Facture';
import Client from './pages/Client';
import Etablissement from './pages/etablissements';
import Agences from './pages/agence';
import BlackList from './pages/BlackList';
import CreerCompte from './pages/creerComptes';
import UpdateFormAgence from './pages/UpdateFormAgence'
import UpdateFormEtablissement from './pages/UpdateFormEtab';
import EtabAgence from './pages/etablissementAgence';
import Login from './pages/Login';
import Navbar from './components/Navbar'
import { useAuthContext } from './hooks/useAuthContext';
import Footer from './components/Footer';
import { useLogout } from './hooks/useLogout';
import './styles/navbar.css'
import './styles/forms.css'
import './styles/footer.css'

function App() {
  const { logout } = useLogout()
  const { user } = useAuthContext()
  const userType = user?.userType

  const handleClick = () => {
    logout()
  }
  return (
    <div className="App">
      <BrowserRouter>


        <Navbar />
        <div className='pages'>

          <Routes>
            <Route path='/Login' element={!user ? <Login /> : <Navigate to='/' />} />
            <Route path='/Logout' element={user ? <Login /> : <Navigate to='/' />} />
            <Route path='/' element={user ? <Home /> : <Navigate to="/Login" />} />
            {/* partiADMIN */}
            <Route path='/Facture' element={user ? <Facture /> : <Navigate to="/Login" />} />
            <Route path='/agences' element={!user ? <Login /> : <Agences/>} />
            <Route path='/etablissements' element={!user ? <Login /> : <Etablissement/>} />
            <Route path='/BlackList/:id' element={user ?<BlackList />:<Navigate to="/Login"/>} />
            <Route path='/creerCompte' element={user ? <CreerCompte /> : <Navigate to="/Login" />} />
            <Route path='/UpdateFormAgence/:id' element={<UpdateFormAgence />} />
            <Route path='/UpdateFormEtablissement/:id' element={<UpdateFormEtablissement />} />
            {/* partieAgence */}
            <Route path='/entreprises/:id' element ={ userType=="CadreAgence" ? <EtabAgence/> : <Navigate to ='/Login'/>} />
            <Route path='/clients/:id' element={userType =="CadreAgence" ? <Client /> : <Navigate to="/Login" />} />
          </Routes>

        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;

