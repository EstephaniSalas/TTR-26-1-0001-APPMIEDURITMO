const express = require("express");
const cors = require("cors");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.usuariosPath = "/api/usuarios";

    //Middlewares  (Funciones que se ejecutan siempre al abrir el servidor, antes de llegar a las rutas)
    this.middlewares();

    //Rutas de mi aplicacion
    this.routes();

    //Manejo de rutas no encontradas
    this.notFound();
  }

  middlewares() {
    //Use es  para usar un  middleware

    //CORS: Es un middleware que permite que mi API sea consumida desde ciertos dominios
    this.app.use(cors());

    //Lectura y parseo del body
    this.app.use(express.json());

    //Directorio publico
    this.app.use(express.static("public"));
  }

  //Endpoints
  routes() {
    // Solicitud a la ruta /api/usuarios de mi archivo
    this.app.use(this.usuariosPath, require("../routes/usuarios"));
  }
    // Middleware para rutas no encontradas (cubre cualquier método)
  notFound() {
    this.app.use((req, res) => {
      res.status(404).json({
        error: "Ruta no encontrada",
        method: req.method,
        path: req.originalUrl
      });
    });
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log("Servidor corriendo en el puerto", this.port);
    });
  }
}

module.exports = Server;
