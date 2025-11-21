const { Router } = require("express");
const { check } = require("express-validator");
const { crearEvento, obtenerEvento, obtenerEventos, modificarEvento, borrarEvento } = require("../controllers/eventos");
const { existeUsuarioPorId } = require("../helpers/db-validators");
const { validarCampos } = require("../middlewares/validar-campos");
const { validarHora24 } = require("../middlewares/eventos");


const router = Router();

router.post("/idUsuario/:idU", [
  check("idU").notEmpty().withMessage("El id del usuario es obligatorio")
    .isMongoId().withMessage("No es un ID usuario válido de MongoDB")
    .custom(existeUsuarioPorId),
  check("tituloEvento").notEmpty().withMessage("El título del evento es obligatorio"),
  check("fechaEvento").notEmpty().withMessage("La fecha del evento es obligatoria")
    .isISO8601().withMessage("La fecha debe tener un formato válido (YYYY-MM-DD)")
    .toDate(),
  check("horaInicio").notEmpty().withMessage("La hora de inicio es obligatoria"),
  check("horaFin").notEmpty().withMessage("La hora de fin es obligatoria"),
  check("importante").optional()
    .isBoolean().withMessage("El campo importante debe ser booleano"),
  validarCampos,
  validarHora24,
], crearEvento);

router.get("/:id", obtenerEvento);

router.get("/", obtenerEventos);

router.put("/", modificarEvento);

router.delete("/", borrarEvento);

module.exports = router;
