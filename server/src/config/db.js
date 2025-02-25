// src/config/db.js
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// Crear la instancia de Sequelize
export const sequelize = new Sequelize(
  'AppConciliacion', // Nombre de la base de datos
  'postgres',         // Nombre de usuario
  '12345',           // Contraseña
  {
    host: 'localhost',  // Host de la base de datos
    dialect: 'postgres',// Dialecto de la base de datos
    timezone: '+00:00', // Zona horaria
  }
);

export default sequelize;

// True: se regenera toda la base de datos
// False: se mantiene la base de datos actual
export const regenerarBD =  false;
