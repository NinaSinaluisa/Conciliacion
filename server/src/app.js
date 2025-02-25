import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

// Importar rutas (ajusta los nombres de las rutas según tu proyecto)
import usuariosRoutes from './routes/userRoutes.js';
import extractosRoutes from './routes/extractoBancarioRoutes.js';
import registrosRoutes from './routes/registroContableRoutes.js'; 
import conciliacionRoutes from './routes/conciliacionRoutes.js';

// Configuración dotenv para cargar variables de entorno
dotenv.config();

// Crear instancia de Express
const app = express();

// Middleware para manejar JSON
app.use(express.json());

// Configuración de CORS
app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:3000', // Para desarrollo
      'https://tusitio.com',  // Para producción
    ];

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Habilitar credenciales
}));

// Manejar solicitudes OPTIONS
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.send();
});

// Middleware de registro para verificar los parámetros de la URL
app.use((req, res, next) => {
  console.log('URL:', req.url);
  console.log('Parámetros:', req.params);
  next();
});

// Configuración de archivos estáticos (por ejemplo, imágenes)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/images', express.static(path.join(__dirname, '../public/images')));

// Ruta de estado
app.get('/status', (req, res) => {
  res.json({ status: 'OK' });
});

// Ruta de prueba
app.get('/test', (req, res) => {
  res.send('Ruta de prueba funciona');
});

// Rutas
app.use('/usuarios', usuariosRoutes);
app.use('/extractos', extractosRoutes);
app.use('/registros', registrosRoutes);
app.use('/conciliacion', conciliacionRoutes);

// Exportar la aplicación
export default app;
