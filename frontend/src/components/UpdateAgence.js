import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
const UpdateAgence = () => {
    const { user } = useAuthContext()
    const [nom, setNom] = useState('')
    const [numeroAgence, setNumeroAgence] = useState('')
    const [adresseAgence, setAdresseAgence] = useState('')
    const [error, setError] = useState('')
    const { id } = useParams()
    const handleSubmit = async () => {
        if (!user) {
            setError('you must be logged in')
            return
        }
        const response = await fetch(`/api/Agences/update/${id}`, {
            method: 'PATCH',
            body: JSON.stringify({ nom, numeroAgence, adresseAgence }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            }
        })

        const json = await response.json()
        if (response.ok) {
            setNom('')
            setNumeroAgence('')
            setAdresseAgence('')
            setError(undefined)
        }
        if (!response.ok) {
            setError(json.error);

        }
    }
    return (
        <div>
            <h3>Mettre a jour l'agence</h3>
            <form className="form" onSubmit={handleSubmit}>
                <label>Nom de l'agence</label>
                <input type="text" value={nom} onChange={(e) => setNom(e.target.value)} />
                <label>Numero de l'agence</label>
                <input type="number" value={numeroAgence} onChange={(e) => setNumeroAgence(e.target.value)} />
                <label>adresse d'agence</label>
                <input type="text" value={adresseAgence} onChange={(e) => setAdresseAgence(e.target.value)} />
                <button type="submit">Mettre a jour</button>
            </form>
        </div>
    );
}

export default UpdateAgence;