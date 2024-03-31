import React, { useState } from 'react'
import '../styles/navbar.css'
import { TbList } from "react-icons/tb";
import { MdClose } from "react-icons/md";
import { BsCollection } from "react-icons/bs";
import { FaRegChartBar, FaHome, } from "react-icons/fa";
import { NavLink } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import { useLogout } from '../hooks/useLogout';
import { CiLogout } from "react-icons/ci";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AddBoxIcon from '@mui/icons-material/AddBox';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
const Navbar = () => {
    const { user } = useAuthContext()

    const { logout } = useLogout()
    const handleClick = () => {
        console.log('handleClick function is called');
        logout();
        console.log('logout');
    }
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(!isOpen);
    let menuItem = []
    let menuItem2 = []
    let menuItem3 = []
    if (user && user.userType === 'admin') {
        menuItem = [

            {
                path: "/",
                name: "Accueil",
                icon: <FaHome />,
            },
            {
                path: "/agences",
                name: "Gestion des Agences",
                icon: <ManageAccountsIcon />,
            },
            {
                path: "/etablissements",
                name: "Gestion Des Entreprises",
                icon: <ManageAccountsIcon />,
            },
            {
                path: "/creerCompte",
                name: "Creer Des Comptes",
                icon: <AddBoxIcon />,
            },
            {



                name: "Logout",
                icon: (
                    <button className='btnLogout' onClick={handleClick}>
                        <CiLogout />

                    </button>
                ),
                path: "/login"


            }

        ]
    }
    if (user && user.userType === 'CadreAgence' && user.agence) {
        const id = user?.agence

        menuItem2 = [

            {
                path: "/",
                name: "Accueil",
                icon: <FaHome />,
            },
            {
                path: `/entreprises/${id}`,
                name: "Liste des entreprises",
                icon: <FormatListBulletedIcon />,
            },
            {
                path: `/clients/${id}`,
                name: "Liste des clients",
                icon: <FormatListBulletedIcon />,
            },
            {
                path: `/BlackList/${id}`,
                name: "Liste noire",
                icon: <RemoveCircleIcon />,
            },

            {
                name: "Logout",
                icon: (
                    <button className='btnLogout' onClick={handleClick}>
                        <CiLogout />

                    </button>
                ),
                path: "/login"
            },

        ]
    }
    if (user && user.userType === 'responsableEntreprise' && user.entreprise) {
        const id = user?.entreprise

        menuItem3 = [

            {
                path: "/",
                name: "Accueil",
                icon: <FaHome />,
            },

            {
                path: `/listClientsEntreprise/${id}`,
                name: "Liste Clients",
                icon: <FormatListBulletedIcon />,
            },

            {
                path: "/listTechnicienEntreprise",
                name: "Liste Techniciens",
                icon: <FormatListBulletedIcon />,
            },
            {
                path: "/ajouterTechnicien",
                name: "Ajouter Technicien",
                icon: <AddCircleIcon />,
            },



            {
                name: "Logout",
                icon: (
                    <button className='btnLogout' onClick={handleClick}>
                        <CiLogout />

                    </button>
                ),
                path: "/login"
            },

        ]
    }

    return (
        <div className='container'>
            < div style={{ width: isOpen ? "220px" : "80px" }} className="sidebar">
                <div className="top-section">
                    <img style={{ display: isOpen ? "block" : "none" }} src={require('../images/myImage.png')} alt="sonelgaz logo" className='logo' />
                    <div style={{ marginLeft: isOpen ? "60px" : "-11px" }} className="bars">
                        {isOpen ? <MdClose onClick={toggle} /> : < TbList onClick={toggle} />}
                    </div>
                </div>

                <div className="menuleft">

                    {menuItem.map((item, index) => (
                        <ul>
                            <NavLink to={item.path} key={index} className="link" activeclassName="active">
                                <div className="icon">{item.icon}</div>
                                <div style={{ display: isOpen ? "block" : "none" }} className="link_text">{item.name}</div>                             </NavLink>

                        </ul>

                    ))}
                </div>
                <div className="menuleft">

                    {menuItem2.map((item, index) => (
                        <ul>
                            <NavLink to={item.path} key={index} className="link" activeclassName="active">
                                <div className="icon">{item.icon}</div>
                                <div style={{ display: isOpen ? "block" : "none" }} className="link_text">{item.name}</div>                             </NavLink>

                        </ul>

                    ))}
                </div>
                <div className="menuleft">

                    {menuItem3.map((item, index) => (
                        <ul>
                            <NavLink to={item.path} key={index} className="link" activeclassName="active">
                                <div className="icon">{item.icon}</div>
                                <div style={{ display: isOpen ? "block" : "none" }} className="link_text">{item.name}</div>                             </NavLink>

                        </ul>

                    ))}
                </div>
            </div>

        </div>
    );
};

export default Navbar;