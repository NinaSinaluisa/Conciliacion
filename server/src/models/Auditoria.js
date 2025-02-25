// src/models/auditoria.js
import { sequelize } from '../config/db.js';
import { DataTypes } from 'sequelize';

export const Auditoria = sequelize.define('Auditoria', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  conciliacionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'conciliaciones',
      key: 'id',
    },
  },
  auditorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'usuarios',
      key: 'id',
    },
  },
  resultado: {
    type: DataTypes.ENUM('aprobado', 'rechazado'),
    allowNull: false,
  },
  observaciones: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  timestamps: false,
  tableName: 'auditorias',
});