import { useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import './css/ResetPasswordPage.css'

const ResetPasswordPage = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');  // nuevo estado
    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validar que las contraseñas coincidan antes de enviar
        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden');
            setMensaje('');
            return;
        }

        try {
            const response = await axios.post('https://shiny-disco-699q69vjq7qx34444-4000.app.github.dev/api/auth/reset-password', {
                token,
                nuevaPassword: password,  
                confirmarPassword: confirmPassword  
            });




            setMensaje(response.data.message || 'Contraseña restablecida');
            setError('');
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || 'Error al restablecer la contraseña');
            setMensaje('');
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content-reset">
                <button className="close-button" onClick={() => window.location.href = '/'}>&times;</button>
                <h2>Restablecer contraseña</h2>

                {mensaje && <p style={{ color: 'green' }}>{mensaje}</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}

                <form onSubmit={handleSubmit}>
                    <input
                        type="password"
                        placeholder="Nueva contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Confirmar contraseña"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    <button type="submit">Restablecer</button>
                </form>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
