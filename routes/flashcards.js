const { Router } = require("express");
const { crearFlascard, obtenerFlashcard, borrarFlashcard, modificarFlascard } = require("../controllers/flashcards");


const router = Router();

router.post("/", crearFlascard ); 
router.get("/", obtenerFlashcard ); 
router.put("/", modificarFlascard ); 
router.delete("/", borrarFlashcard ); 


module.exports = router;
