import { sequelize } from '../config/db.js';
import { DataTypes } from 'sequelize';

export const RegistroContable = sequelize.define('RegistroContable', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  fecha: {
    type: DataTypes.DATEONLY,
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
  periodo: {
    type: DataTypes.STRING(7),
    allowNull: false,
  }
}, {
  timestamps: false,
  tableName: 'registros_contables',
});