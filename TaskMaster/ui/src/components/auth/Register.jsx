import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Form, Container, Card, Alert } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext'; // 👈 Importa useAuth

function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState(''); // 👈 Define el estado para mensajes
    const [isError, setIsError] = useState(false); // 👈 Define el estado para errores
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth(); // 👈 Obtiene la función login del contexto
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');
        setIsError(false);

        try {
            // Registrar al usuario
            const response = await fetch('http://localhost:8000/api/auth/register/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                // Intentar iniciar sesión automáticamente
                try {
                    const loginResponse = await fetch('http://localhost:8000/api/auth/login/', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email, password })
                    });

                    if (loginResponse.ok) {
                        const loginData = await loginResponse.json();
                        login(loginData.access, email); // 👈 Usar login del contexto
                        navigate('/');
                    } else {
                        setMessage('Registration successful! Please login.');
                        setIsError(false);
                    }
                } catch (loginErr) {
                    setMessage('Registration successful! Please login.');
                    setIsError(false);
                }
            } else {
                const errorData = await response.json();
                setMessage(errorData.email?.[0] || 'Registration failed');
                setIsError(true);
            }
        } catch (err) {
            setMessage('Network error. Please try again.');
            setIsError(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
            <div className="w-100" style={{ maxWidth: '400px' }}>
                <Card>
                    <Card.Body>
                        <h2 className="text-center mb-4">Create Account</h2>

                        {message && <Alert variant={isError ? 'danger' : 'success'}>{message}</Alert>}

                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="Enter email"
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    placeholder="Password"
                                />
                            </Form.Group>

                            <Button
                                variant="primary"
                                type="submit"
                                className="w-100 mt-3"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Creating account...' : 'Sign Up'}
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>

                <div className="w-100 text-center mt-2">
                    Already have an account? <Link to="/login">Log In</Link>
                </div>
            </div>
        </Container>
    );
}

export default Register;