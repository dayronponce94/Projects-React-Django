import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';

function Navigation() {
    const navigate = useNavigate();
    const { currentUser, logout } = useAuth();

    const getUsername = () => {
        if (!currentUser || !currentUser.email) return "User";

        try {
            return currentUser.email.split('@')[0];
        } catch (error) {
            console.error("Error getting username:", error);
            return "User";
        }
    };

    return (
        <Navbar bg="light" expand="lg" className="mb-4 shadow-sm">
            <Container>
                <Navbar.Brand as={Link} to="/" className="text-primary fw-bold">
                    TaskMaster
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="basic-navbar-nav" />

                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        {currentUser && (
                            <Nav.Link as={Link} to="/">Dashboard</Nav.Link>
                        )}
                    </Nav>

                    <Nav className="align-items-center">
                        {currentUser ? (
                            <>
                                <span className="me-3 text-muted">
                                    Hello, <strong>{getUsername()}</strong>
                                </span>
                                <Button
                                    variant="outline-danger"
                                    onClick={logout}
                                    className="me-2"
                                >
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    as={Link}
                                    to="/login"
                                    variant="outline-primary"
                                    className="me-2"
                                >
                                    Login
                                </Button>
                                <Button
                                    as={Link}
                                    to="/register"
                                    variant="primary"
                                >
                                    Register
                                </Button>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Navigation;