import { useAuthContext } from "../hooks/useAuthContext";
import Dashboard from "../components/dashboard";
const Home = () => {
    const {user}= useAuthContext();
    const userType = user?.userType
    const Nom = user?.nom
    let dashboardContent
    switch (userType){
    case "admin": dashboardContent= <Dashboard/>; break;
    case "CadreAgence": dashboardContent=

    <Dashboard/>
     ; break;
    case "responsableEntreprise": dashboardContent=  <Dashboard/>  ; break;
    case "technicien" : dashboardContent = <h1>technicien dashboard</h1> ; break;
    default :dashboardContent=<h1>404 not found</h1> ; break;
    

    
    }
    return (
     <div className="Container">
        {dashboardContent}
     </div>
    );

}
 
export default Home;