const { Router } = require("express");
const {check} = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const { existeCorreo, existeUsuarioPorId } = require("../helpers/db-validators");

const {
  obtenerUsuario,
  crearUsuario,
  actualizarUsuario,
  borrarUsuario,
  solicitarCambioPassword,
  confirmarCambioPassword,
} = require("../controllers/usuarios");
const { validarPassIguales } = require("../middlewares/usuarios");

const router = Router();


//Metodos: Endpoints

// :: POST - crear usuario
//falta validar contraseñas iguales en el crear usuario
router.post("/", [
  check('nombre', 'El nombre es obligatorio').not().isEmpty(), 
  check('correo', 'El correo no es valido').notEmpty().isEmail().custom(existeCorreo),
  check('password', 'El password es obligatorio y debe de ser de al menos 8 caracteres').isLength({ min: 8 }),
  check('password2', 'El password2 es obligatorio y debe de ser de al menos 8 caracteres').isLength({ min: 8 }),
  validarCampos,
  validarPassIguales,
], crearUsuario);

// :: GET - obtener el usuario actual
router.get("/:id", [
  check('id')
    .notEmpty().withMessage('El ID es obligatorio')
    .isMongoId().withMessage('No es un ID válido de MongoDB'),
  check('id').custom(existeUsuarioPorId),
  validarCampos
], obtenerUsuario); 

// :: PUT - actualizar usuario actual
router.put("/:id", [
  check('id').notEmpty().withMessage('El id es obligatorio'),
  check('id', 'No es un ID válido de MongoDB').isMongoId(),
  check('id').custom(existeUsuarioPorId),
  validarCampos
], actualizarUsuario);

// :: POST - solicitar cambio de contraseña
router.post("/solicitud-cambio-password", [
  //validar que el correo exista
  check('correo').notEmpty().withMessage("el campo no puede estar vacio").isEmail().withMessage("No es un correo"),
  validarCampos
], solicitarCambioPassword);

// :: POST - confirmar cambio de contraseña con codigo
router.post("/confirmar-cambio-password", [
  check('correo').notEmpty().withMessage("el campo no puede estar vacio").isEmail().withMessage("No es un correo"),
  check('codigo', 'El codigo es obligatorio').not().isEmpty(),
  check('password', 'El nuevo password es obligatorio y debe de ser de al menos 8 caracteres').notEmpty().isLength({ min: 8 }),
  check('password2', 'El nuevo password2 es obligatorio y debe de ser de al menos 8 caracteres').notEmpty().isLength({ min: 8 }),
  validarPassIguales,
  validarCampos
], confirmarCambioPassword);

// :: DELETE - borrar usuario
router.delete("/:id", [
  check('id', 'No es un ID válido de MongoDB').isMongoId(),
  check('id').custom(existeUsuarioPorId),
  validarCampos
], borrarUsuario);


module.exports = router;
