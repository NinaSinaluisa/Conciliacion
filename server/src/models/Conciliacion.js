// src/models/conciliacion.js
import { sequelize } from '../config/db.js';
import { DataTypes } from 'sequelize';
import { ExtractoBancario } from './ExtractoBancario.js';
import { RegistroContable } from './RegistroContable.js';

export const Conciliacion = sequelize.define('Conciliacion', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  periodo: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Período de la conciliación (ej: 2025-02)',
  },
  saldoSegunBancos: {
    type: DataTypes.FLOAT,
    allowNull: false,
    comment: 'Saldo según los bancos',
  },
  saldoSegunLibros: {
    type: DataTypes.FLOAT,
    allowNull: false,
    comment: 'Saldo según los libros contables',
  },
  diferencia: {
    type: DataTypes.FLOAT,
    allowNull: true,
    comment: 'Diferencia entre el saldo del banco y los libros',
  },
  cargosBancoNoEmpresa: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Cargos registrados en el banco pero no en la empresa',
  },
  cargosEmpresaNoBanco: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Cargos registrados en la empresa pero no en el banco',
  },
  abonosBancoNoEmpresa: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Abonos registrados en el banco pero no en la empresa',
  },
  abonosEmpresaNoBanco: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Abonos registrados en la empresa pero no en el banco',
  },
  estado: {
    type: DataTypes.ENUM('pendiente', 'aprobado', 'rechazado'),
    allowNull: false,
    defaultValue: 'pendiente',
    comment: 'Estado de la conciliación',
  },
  observaciones: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Observaciones adicionales',
  },
  extractoBancarioId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: ExtractoBancario,
      key: 'id',
    },
    comment: 'ID del extracto bancario relacionado',
  },
  registroContableId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: RegistroContable,
      key: 'id',
    },
    comment: 'ID del registro contable relacionado',
  },
}, {
  timestamps: false,
  tableName: 'conciliaciones',
  comment: 'Tabla para almacenar las conciliaciones bancarias',
});

// Relaciones correctas
Conciliacion.belongsTo(ExtractoBancario, { foreignKey: 'extractoBancarioId' });
Conciliacion.belongsTo(RegistroContable, { foreignKey: 'registroContableId' });
ExtractoBancario.hasMany(Conciliacion, { foreignKey: 'extractoBancarioId' });
RegistroContable.hasMany(Conciliacion, { foreignKey: 'registroContableId' });
