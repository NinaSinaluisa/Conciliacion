import app from './app.js'; // Asegúrate de tener tu archivo app.js que configura el servidor
import { regenerarBD, sequelize } from './config/db.js'; // Importar la conexión de base de datos

// Importar modelos
import './models/Auditoria.js';
import './models/RegistroContable.js';
import './models/ExtractoBancario.js';
import './models/User.js'; // Asegúrate de incluir todos tus modelos aquí
import './models/Conciliacion.js';

// Importar y definir asociaciones entre los modelos
//import { defineAssociations } from './models/associations.js'; // Si tienes un archivo para definir asociaciones
//defineAssociations();

async function main() {
    try {
        // Sincronizar la base de datos
        await sequelize.sync({ force: regenerarBD });

        // Iniciar el servidor en el puerto especificado
        const port = process.env.PORT || 4000; // Si no hay puerto definido, usa el 4000
        app.listen(port, () => {
            console.log(`Servidor escuchando en el puerto ${port}`);
        });
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error);
    }
}

main();
