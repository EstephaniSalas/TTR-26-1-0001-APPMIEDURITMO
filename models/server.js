const express = require("express");
const cors = require("cors");
const { dbConection } = require("../database/config");
const cookieParser = require("cookie-parser");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3333;

    this.paths = {
      usuarios: "/api/usuarios",
      materias: "/api/materias",
      eventos: "/api/eventos",
      tareas: "/api/tareas",
      notas: "/api/notas",
      flashcards: "/api/flashcards",
      autenticacion: "/api/autenticacion",
      sesionesEstudio: "/api/sesiones-estudio",
      calendarioSep: "/api/calendario-sep",
    };
    
    //Conectar a base de datos
    this.conectarDB();

    //Middlewares  (Funciones que se ejecutan siempre al abrir el servidor, antes de llegar a las rutas)
    this.middlewares();

    //Rutas de mi aplicacion
    this.routes();

    //Manejo de rutas no encontradas
    this.notFound();
  }
  
  async conectarDB() {
    await dbConection();
  }

  middlewares() {
    //Use es  para usar un  middleware

    //CORS: Es un middleware que permite que mi API sea consumida desde ciertos dominios
    this.app.use(cors({
    origin: '*', // Permite todas las origins (para desarrollo)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true
  }));

    //Lectura y parseo del body
    this.app.use(express.json());

    // Habilitar cookie-parser
    this.app.use(cookieParser());

    //Directorio publico
    this.app.use(express.static("public"));
  }

  //Endpoints
  routes() {
    // Solicitud a la ruta /api/usuarios de mi archivo
    this.app.use(this.paths.eventos, require("../routes/eventos"));
    this.app.use(this.paths.flashcards, require("../routes/flashcards"));
    this.app.use(this.paths.materias, require("../routes/materias"));
    this.app.use(this.paths.notas, require("../routes/notas"));
    this.app.use(this.paths.tareas, require("../routes/tareas"));
    this.app.use(this.paths.usuarios, require("../routes/usuarios"));
    this.app.use(this.paths.autenticacion, require("../routes/autenticacion"));
    this.app.use(this.paths.sesionesEstudio, require("../routes/sesionEstudio"));
    this.app.use(this.paths.calendarioSep, require("../routes/calendarioSep")); 

  }
  // Middleware para rutas no encontradas (cubre cualquier método)
  notFound() {
    this.app.use((req, res) => {
      res.status(404).json({
        error: "Ruta no encontrada",
        method: req.method,
        path: req.originalUrl,
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
