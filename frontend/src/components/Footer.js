import { Link } from "react-router-dom";
const Footer = () => {
    return ( 
        <footer className="footer">
            <div className="social-media">
                <p>join us on :</p>
                <br/>
             <Link to ='https://www.facebook.com/'>facebook</Link>  
             <Link to ='https://www.instagram.com/'>instagram</Link>  

            </div>
            <p>all rights reserverd Sonalgaz ©</p>
        </footer>
     );
}
 
export default Footer;