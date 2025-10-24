const { Router } = require("express");
const {check} = require("express-validator");

const { validarCampos } = require("../middlewares/validar-campos");
const { existeCorreo, existeUsuarioPorId } = require("../helpers/db-validators");


const {
  obtenerUsuario,
  crearUsuario,
  actualizarUsuario,
  borrarUsuario,
} = require("../controllers/usuarios");

const router = Router();


//Metodos: Endpoints
router.post("/", [
  check('nombre', 'El nombre es obligatorio').not().isEmpty(), 
  check('correo', 'El correo no es valido').isEmail(),
  check('correo').custom(existeCorreo),
  check('password', 'El password es obligatorio y debe de ser de al menos 8 caracteres').isLength({ min: 8 }),
  check('password2', 'El password2 es obligatorio y debe coincidir')
  .isLength({ min: 8 })
  .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Las contraseñas no coinciden');
      }
      return true;
    }),
  validarCampos
], crearUsuario);

router.get("/:id", [
  check('id', 'No es un ID válido de MongoDB').isMongoId(),
  check('id').custom(existeUsuarioPorId),
  validarCampos
], obtenerUsuario); 

router.put("/:id", [
  check('id', 'No es un ID válido de MongoDB').isMongoId(),
  check('id').custom(existeUsuarioPorId),
  validarCampos
], actualizarUsuario);

router.delete("/:id", [
  check('id', 'No es un ID válido de MongoDB').isMongoId(),
  check('id').custom(existeUsuarioPorId),
  validarCampos
], borrarUsuario);


module.exports = router;
