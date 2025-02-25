import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Importa Link para navegación
import '../utils/HomePage.css'; // Asegúrate de que este archivo de CSS exista
import LoginPage from './LoginPage';
import logo from '../components/public/imagen.gif'; // Logo de la aplicación
import logo1 from '../components/public/image.png'; // Logo de la aplicación

const HomePage = () => {
    const [currentPage, setCurrentPage] = useState('home'); // Estado para manejar la página actual

    const handleNavClick = (page) => {
        setCurrentPage(page); // Cambia la página actual
    };
    
    const handleStartClick = () => {
        setCurrentPage('login'); // Cambia a la página de login
    };

    return (
        <div className="homepage-container">
            <header className="homepage-header">
                <div className="logo">
                    <h3>Bienvenido al sistema de conciliacion bancaria</h3>
                </div>
                <nav className="homepage-navbar">
                    {/* Solo tenemos un par de enlaces */}
                    <Link to="/" onClick={() => handleNavClick('home')}>Inicio</Link><br />
                    <button className="btn-green" onClick={handleStartClick}>Empezar</button>
                </nav>
            </header>
            <main className="homepage-main">
                {currentPage === 'home' && (
                    <>
                        <section className="intro-section">
                            <div className="intro-text">
                                <h2>Información General</h2>
                                <p>Bienvenido a nuestra plataforma. Aquí podrás acceder a todas las funcionalidades disponibles. Haz clic en "Empezar" para iniciar sesión.</p>
                            </div><br />
                            <div className="intro-image">
                                <img src={logo} alt="Logo" />
                                
                            </div>
                            <br />
                            <div className="intro-image">
                                <img src={logo1} alt="Logo" />
                            </div>
                        </section>
                    </>
                )}
                {currentPage === 'login' && <LoginPage />}
            </main>
        </div>
    );
};

export default HomePage;
