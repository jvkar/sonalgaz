import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
const UpdateEtablissement = () => {
    const { user } = useAuthContext()
    const [Nom, setNom] = useState('')
    const [NumeroEtablissement, setNumeroEtablissement] = useState('')
    const [Adresse, setAdresse] = useState('')
    const [error, setError] = useState('')
    const { id } = useParams()
    const handleSubmit = async () => {
        if (!user) {
            setError('you must be logged in');
            return
        }
        const response = await fetch(`/api/Etablissements/update/${id}`, {
            method: 'PATCH',
            body: JSON.stringify({ Nom, NumeroEtablissement, Adresse }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            }
        })

        const json = await response.json()
        if (response.ok) {
            setNom('')
            setNumeroEtablissement('')
            setAdresse('')
            setError(undefined)
        }
        if (!response.ok) {
            setError(json.error);
            console.log(json)
        }
    }
    return (
        <div>
            <h3>Mettre a jour l'enterprise</h3>
            <form className="form" onSubmit={handleSubmit}>
                <label>Nom de l'enterprise</label>
                <input type="text" value={Nom} onChange={(e) => setNom(e.target.value)} />
                <label>Numero de l'entreprise</label>
                <input type="number" value={NumeroEtablissement} onChange={(e) => setNumeroEtablissement(e.target.value)} />
                <label>adresse d'entreprise</label>
                <input type="text" value={Adresse} onChange={(e) => setAdresse(e.target.value)} />
                <button type="submit">Mettre a jour</button>
            </form>
        </div>
    );
}

export default UpdateEtablissement;