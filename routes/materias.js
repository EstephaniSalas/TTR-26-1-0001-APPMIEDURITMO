const { Router } = require("express");
const { crearMateria, obtenerMateria, obtenerMaterias, modificarMateria, borrarMateria } = require("../controllers/materias");

const router = Router();

router.post("/", crearMateria); 
router.get("/:id", obtenerMateria);
router.get("/", obtenerMaterias);
router.put("/", modificarMateria);
router.delete("/", borrarMateria);

module.exports = router;
