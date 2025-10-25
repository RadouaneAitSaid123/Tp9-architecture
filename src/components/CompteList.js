import {useEffect, useState} from "react";
import axios from "axios";
import API_BASE_URL from "../config";
import CompteForm from "./CompteForm";

function CompteList() {
    const [comptes, setComptes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [highlightId, setHighlightId] = useState(null);

    const fetchComptes = () => {
        setLoading(true);
        setError(null);
        return axios
            .get(`${API_BASE_URL}/comptes`)
            .then((response) => setComptes(response.data))
            .catch((err) => {
                console.error(err);
                setError("Impossible de charger la liste");
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchComptes();
    }, []);

    // when created, refetch and highlight the new item briefly
    const handleCreated = (created) => {
        fetchComptes().then(() => {
            if (created && created.id) {
                setHighlightId(created.id);
                setTimeout(() => setHighlightId(null), 3000);
            }
        });
    };

    return (
        <>
            <div className="container mt-4">
                <div className="d-flex align-items-center mb-3">
                    <h2 className="me-auto">Liste des Comptes</h2>
                    <div>
                        <button className="btn btn-outline-secondary me-2" onClick={fetchComptes} disabled={loading}>
                            {loading ? (
                                <span className="spinner-border spinner-border-sm" role="status"
                                      aria-hidden="true"></span>
                            ) : (
                                "Rafraîchir"
                            )}
                        </button>
                    </div>
                </div>

                <CompteForm onCreated={handleCreated}/>

                {error && <div className="alert alert-danger">{error}</div>}

                {!loading && comptes.length === 0 && (
                    <div className="alert alert-info">Aucun compte trouvé.</div>
                )}

                <div className="table-responsive">
                    <table className="table table-bordered">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Solde</th>
                            <th>Date de Création</th>
                            <th>Type</th>
                        </tr>
                        </thead>
                        <tbody>
                        {comptes.map((compte) => (
                            <tr key={compte.id} className={compte.id === highlightId ? "table-success" : ""}>
                                <td>{compte.id}</td>
                                <td>{compte.solde}</td>
                                <td>{compte.dateCreation}</td>
                                <td>{compte.typeCompte}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

export default CompteList;