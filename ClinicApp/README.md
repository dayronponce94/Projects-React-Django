# ClinicApp - Sistema de Gestión de Turnos Médicos / Medical Appointment Management System

Aplicación web completa para la gestión de turnos médicos online, construida con React y Django.
Complete web application for online medical appointment management, built with React and Django.

## Tecnologías / Technologies

## Instalación y Configuración / Installation and Configuration
### Backend
- Django 5.2.5
- Django REST Framework 3.16.1
- Simple JWT para autenticación
- Django CORS Headers
- SQLite3 (base de datos)

### Frontend
- React 18
- React Router DOM
- Axios para peticiones HTTP
- Tailwind CSS 3.4.3
- Date-fns para manejo de fechas

### Backend (Django)
```bash
# Navegar a la carpeta del backend
# Navigate to the backend folder
cd ClinicApp/api

# Crear entorno virtual (Windows)
# Create virtual environment (Windows)
python -m venv venv

# Activar entorno virtual (Windows)
# Activate virtual environment (Windows)
venv\Scripts\activate

# Instalar dependencias
# Install dependencies
pip install -r requirements.txt

# Aplicar migraciones
# Apply migrations
python manage.py migrate

# Crear superusuario 
# Create superuser 
python manage.py createsuperuser

# Ejecutar servidor de desarrollo
# Run development server
python manage.py runserver

### Frontend (Rect)
# Navegar a la carpeta del frontend
# Navigate to the frontend folder
cd ClinicApp/ui

# Instalar dependencias
# Install dependencies
npm install

# Ejecutar servidor de desarrollo
# Run development server
npm start