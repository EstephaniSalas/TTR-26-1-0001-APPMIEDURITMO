const { Router } = require("express");
const { crearEvento, obtenerEvento, obtenerEventos, modificarEvento, borrarEvento } = require("../controllers/eventos");


const router = Router();

router.post("/", crearEvento);
router.get("/:id", obtenerEvento);
router.get("/", obtenerEventos);
router.put("/", modificarEvento);
router.delete("/", borrarEvento);

module.exports = router;
