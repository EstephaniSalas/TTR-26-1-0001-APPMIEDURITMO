const { Router } = require("express");
const {
  obtnerUsuario,
  crearUsuario,
  actualizarUsuario,
} = require("../controllers/usuarios");

const router = Router();

//Metodos: Endpoints
//get es para leer
router.get("/", obtnerUsuario); //.json es el tipo de respuesta que quiero dar (puede ser .send, .json, etc)

// put es para actualizar
router.put("/", actualizarUsuario);

//post es para crear
router.post("/", crearUsuario);

module.exports = router;
