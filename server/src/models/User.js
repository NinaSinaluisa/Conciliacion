// src/models/user.js
import { sequelize } from '../config/db.js';  // Importar la instancia de sequelize
import { DataTypes } from 'sequelize';

export const User = sequelize.define('usuarios', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('contador', 'jefe_contador', 'auditor'),
    allowNull: false,
  },
}, {
  timestamps: false,
  tableName: 'usuarios', // Asegúrate de que el nombre de la tabla coincida con la de tu base de datos
});
