const { Router } = require("express");
const { crearNota, obtenerNota, obtenerNotas, modificarNota, borrarNota } = require("../controllers/notas");

const router = Router();


router.post("/", crearNota); 
router.get("/:id", obtenerNota);
router.get("/", obtenerNotas);
router.put("/", modificarNota);
router.delete("/", borrarNota);


module.exports = router;
