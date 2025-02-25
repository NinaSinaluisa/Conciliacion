// Modelo ExtractoBancario
import { sequelize } from '../config/db.js';
import { DataTypes } from 'sequelize';

export const ExtractoBancario = sequelize.define('ExtractoBancario', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  fecha: {
    type: DataTypes.DATEONLY, // Ajustado a DATEONLY si solo se almacena la fecha
    allowNull: false,
  },
  concepto: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  referencia: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  cargos: {
    type: DataTypes.FLOAT,
    allowNull: true,
    defaultValue: 0,
  },
  abonos: {
    type: DataTypes.FLOAT,
    allowNull: true,
    defaultValue: 0,
  },
  saldo: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  periodo: {
    type: DataTypes.STRING(7), // Formato "YYYY-MM"
    allowNull: false,
  }
}, {
  timestamps: false,
  tableName: 'extractos_bancarios',
});