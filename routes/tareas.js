const { Router } = require("express");
const { crearTarea, 
    obtenerTarea, 
    obtenerTareas, 
    actualizarTarea, 
    borrarTarea, 
    cambiarStatusTarea } = require("../controllers/tareas");

const router = Router();

router.post("/",crearTarea ); 
router.get("/:id",obtenerTarea ); 
router.get("/",obtenerTareas ); 
router.put("/",actualizarTarea );
router.patch("/", cambiarStatusTarea);
router.delete("/", borrarTarea);

module.exports = router;
