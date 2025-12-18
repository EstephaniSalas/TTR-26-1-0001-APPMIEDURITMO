const { Router } = require("express");
const { check } = require("express-validator");

const { crearEvento, obtenerEvento, obtenerEventos, modificarEvento, borrarEvento, borrarEventos, obtenerEventosFuturos } = require("../controllers/eventos");
const { existeUsuarioPorId, existeEventoPorId, } = require("../helpers/db-validators");
const { validarCampos } = require("../middlewares/validar-campos");
const { validarHora24, 
        validarHora24Opcional,
        validarEventoUsuario,
      validarCamposEventoUpdate } = require("../middlewares/eventos");
const { validarJWT } = require("../middlewares/validar-jwt");

const router = Router();

// ::: Post - Craer evento para un usuario por id :::
router.post("/idUsuario/:idU", [
  validarJWT,
  check("idU").notEmpty().withMessage("El id del usuario es obligatorio")
    .isMongoId().withMessage("No es un ID usuario válido de MongoDB")
    .custom(existeUsuarioPorId),
  check("tituloEvento").notEmpty().withMessage("El título del evento es obligatorio"),
  check("fechaEvento").notEmpty().withMessage("La fecha del evento es obligatoria")
    .isISO8601().withMessage("La fecha debe tener un formato válido (YYYY-MM-DD)")
    .toDate(),
  check("horaInicio").notEmpty().withMessage("La hora de inicio es obligatoria"),
  check("horaFin").notEmpty().withMessage("La hora de fin es obligatoria"),
  check("descripcionEvento").optional()
    .isString().withMessage("La descripción debe ser texto"),
  check("importante").optional()
    .isBoolean().withMessage("El campo importante debe ser booleano"),
  validarCampos,
  validarHora24,
], crearEvento);



// ::: Get - Obtener un evento por usuario :::
router.get("/idUsuario/:idU/idEvento/:idE", [
  validarJWT,
  check("idU")
    .notEmpty().withMessage("El id del usuario es obligatorio")
    .isMongoId().withMessage("No es un ID usuario válido de MongoDB")
    .custom(existeUsuarioPorId),
  check("idE")
    .notEmpty().withMessage("El id del evento es obligatorio")
    .isMongoId().withMessage("No es un ID evento válido de MongoDB")
    .custom(existeEventoPorId),
  validarCampos,
  validarEventoUsuario, // verifica que el evento pertenezca al usuario
], obtenerEvento);



// ::: Get - Obtner todos los eventos por usuario :::
router.get("/idUsuario/:idU/", [
   validarJWT,
  check("idU")
    .notEmpty().withMessage("El id del usuario es obligatorio")
    .isMongoId().withMessage("No es un ID usuario válido de MongoDB")
    .custom(existeUsuarioPorId),
  validarCampos,
], obtenerEventos);



// ::: Put - Modificar un evento por usuario
router.put("/idUsuario/:idU/idEvento/:idE", [
  validarJWT,
  check("idU")
    .notEmpty().withMessage("El id del usuario es obligatorio")
    .isMongoId().withMessage("No es un ID usuario válido de MongoDB")
    .custom(existeUsuarioPorId),
  check("idE")
    .notEmpty().withMessage("El id del evento es obligatorio")
    .isMongoId().withMessage("No es un ID evento válido de MongoDB")
    .custom(existeEventoPorId),
  check("tituloEvento").optional()
    .notEmpty().withMessage("El título no puede ir vacío"),
  check("descripcionEvento").optional()
    .isString().withMessage("La descripción debe ser texto"),
  check("fechaEvento").optional()
    .isISO8601().withMessage("La fecha debe tener un formato válido (YYYY-MM-DD)")
    .toDate(),
  check("horaInicio").optional()
    .notEmpty().withMessage("La hora de inicio no puede ir vacía"),
  check("horaFin").optional()
    .notEmpty().withMessage("La hora de fin no puede ir vacía"),
  check("importante").optional()
    .isBoolean().withMessage("importante debe ser booleano"),
  validarCampos,
  validarEventoUsuario,       // asegura que el evento es del usuario
  validarCamposEventoUpdate,  // obliga a enviar al menos un campo
  validarHora24Opcional,      // valida horas solo si vienen
],modificarEvento);



// ::: Delete - Borrrar un evento por usaurio ::: 
router.delete("/idUsuario/:idU/idEvento/:idE", [
  validarJWT,
  check("idU")
    .notEmpty().withMessage("El id del usuario es obligatorio")
    .isMongoId().withMessage("No es un ID usuario válido de MongoDB")
    .custom(existeUsuarioPorId),
  check("idE")
    .notEmpty().withMessage("El id del evento es obligatorio")
    .isMongoId().withMessage("No es un ID evento válido de MongoDB")
    .custom(existeEventoPorId),
  validarCampos,
  validarEventoUsuario,
],borrarEvento);



// Delete - Borrar TODOS los eventos de un usuario :::
router.delete("/idUsuario/:idU", [
  validarJWT,
  check("idU")
    .notEmpty().withMessage("El id del usuario es obligatorio")
    .isMongoId().withMessage("No es un ID usuario válido de MongoDB")
    .custom(existeUsuarioPorId),
  validarCampos,
],borrarEventos);


//______________________
//Apartado para notificaciones. 
// ::: Get - Obtener EVENTOS FUTUROS para sincronización de notificaciones :::
router.get("/idUsuario/:idU/futuros", [
  validarJWT,
  check("idU")
    .notEmpty().withMessage("El id del usuario es obligatorio")
    .isMongoId().withMessage("No es un ID usuario válido de MongoDB")
    .custom(existeUsuarioPorId),
  validarCampos,
], obtenerEventosFuturos);

module.exports = router;
