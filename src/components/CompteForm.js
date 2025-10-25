import {useState} from "react";
import axios from "axios";
import API_BASE_URL from "../config";

const today = new Date().toISOString().split("T")[0];

function CompteForm({onCreated} = {}) {
    const initial = {solde: "", dateCreation: today, typeCompte: "COURANT"};
    const [compte, setCompte] = useState(initial);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState(null);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setCompte((c) => ({...c, [name]: value}));
        setErrors(null);
    };

    const validate = () => {
        const err = {};
        if (compte.solde !== "" && isNaN(Number(compte.solde))) {
            err.solde = "Solde invalide";
        }
        if (!compte.dateCreation) {
            err.dateCreation = "Date requise";
        }
        return Object.keys(err).length ? err : null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const v = validate();
        if (v) {
            setErrors(v);
            return;
        }

        setLoading(true);
        const payload = {
            ...compte,
            solde: compte.solde === "" ? null : Number(compte.solde),
        };

        try {
            const response = await axios.post(`${API_BASE_URL}/comptes`, payload);
            // feedback minimal
            alert("Compte ajouté");
            setCompte(initial);
            if (typeof onCreated === "function") {
                onCreated(response.data);
            }
        } catch (err) {
            console.error(err);
            alert("Erreur lors de la création");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mb-4">
            <div className="row">
                <div className="col-md-4">
                    <h2>Ajouter un Compte</h2>
                    <form onSubmit={handleSubmit} aria-live="polite">
                        <div className="mb-3">
                            <label>Solde</label>
                            <input
                                type="number"
                                name="solde"
                                className={`form-control ${errors?.solde ? "is-invalid" : ""}`}
                                value={compte.solde}
                                onChange={handleChange}
                                step="0.01"
                                min="0"
                                autoFocus
                                aria-invalid={!!errors?.solde}
                            />
                            {errors?.solde && (
                                <div className="invalid-feedback">{errors.solde}</div>
                            )}
                        </div>

                        <div className="mb-3">
                            <label>Date de Création</label>
                            <input
                                type="date"
                                name="dateCreation"
                                className={`form-control ${errors?.dateCreation ? "is-invalid" : ""}`}
                                value={compte.dateCreation}
                                onChange={handleChange}
                                max={today}
                                aria-invalid={!!errors?.dateCreation}
                            />
                            {errors?.dateCreation && (
                                <div className="invalid-feedback">{errors.dateCreation}</div>
                            )}
                        </div>

                        <div className="mb-3">
                            <label>Type</label>
                            <select
                                name="typeCompte"
                                className="form-select"
                                value={compte.typeCompte}
                                onChange={handleChange}
                            >
                                <option value="COURANT">Courant</option>
                                <option value="EPARGNE">Épargne</option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                            aria-disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm" role="status"
                                          aria-hidden="true"></span>
                                    &nbsp;Envoi...
                                </>
                            ) : (
                                "Ajouter"
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default CompteForm;

