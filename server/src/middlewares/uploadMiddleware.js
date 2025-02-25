import multer from 'multer';
import fs from 'fs';
import path from 'path';

// Verificar si la carpeta "uploads" existe, si no, crearla
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuración del almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Guardar archivos en la carpeta "uploads"
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// Filtrar archivos permitidos (CSV, TXT, LOG)
const fileFilter = (req, file, cb) => {
  const allowedExtensions = ['.csv', '.txt', '.log'];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten archivos CSV, TXT y LOG.'), false);
  }
};

// Configuración de Multer
const upload = multer({ storage, fileFilter });

export default upload;
