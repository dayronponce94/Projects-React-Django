import React from 'react';
import { Container } from 'react-bootstrap';

function Footer() {
    return (
        <footer className="mt-auto py-3 bg-light border-top">
            <Container className="text-center text-muted">
                TaskMaster © {new Date().getFullYear()} - Simple Task Management System
            </Container>
        </footer>
    );
}

export default Footer;