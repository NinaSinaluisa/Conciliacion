// src/middlewares/authMiddleware.js
import jwt from "jsonwebtoken";

const SECRET_KEY = 'secreto';  // Usa la misma clave que en userService.js

const authMiddleware = (req, res, next) => {
  try {
    // Obtener el token del header "Authorization"
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).json({ error: "Unauthorized: Token no proporcionado" });
    }

    // Verificar que el token tenga el formato correcto "Bearer TOKEN"
    const tokenParts = authHeader.split(" ");
    if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
      return res.status(401).json({ error: "Unauthorized: Formato de token inválido" });
    }

    const token = tokenParts[1];

    // Verificar el token con la clave secreta
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(403).json({ error: "Invalid token" });
      }

      req.user = decoded; // Agregar usuario decodificado a la request
      next(); // Pasar al siguiente middleware/controlador
    });

  } catch (error) {
    return res.status(500).json({ error: "Error en la autenticación" });
  }
};

export default authMiddleware;
