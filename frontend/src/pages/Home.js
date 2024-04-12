import { useAuthContext } from "../hooks/useAuthContext";
const Home = () => {
    const {user}= useAuthContext();
    const userType = user?.userType
    const Nom = user?.nom
    let dashboardContent
    switch (userType){
    case "admin": dashboardContent= <h1>admin dashboard</h1>; break;
    case "CadreAgence": dashboardContent= <h1>cadre d'agence de  {Nom} dashboard</h1>; break;
    case "responsableEntreprise": dashboardContent= <h1>Responsable de l'entreprise {Nom} dashboard</h1>; break;
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