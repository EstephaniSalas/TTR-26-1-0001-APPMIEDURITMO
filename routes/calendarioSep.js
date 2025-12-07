const { Router } = require("express");
const { check } = require("express-validator");

const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validar-jwt");
const { obtenerCalendarioSep } = require("../controllers/calendarioSep");

const router = Router();

/**
 * GET - Obtener días del calendario SEP
 * /api/calendario-sep?desde=YYYY-MM-DD&hasta=YYYY-MM-DD&tipo=SUSPENSION&ciclo=2024-2025
 */
router.get("/",[
    validarJWT, 
    check("desde")
      .optional()
      .isISO8601()
      .withMessage("desde debe tener formato YYYY-MM-DD"),
    check("hasta")
      .optional()
      .isISO8601()
      .withMessage("hasta debe tener formato YYYY-MM-DD"),
    check("tipo")
      .optional()
      .isIn(["CLASES", "SUSPENSION", "VACACIONES", "PERIODO_EVALUACION", "OTRO"])
      .withMessage("tipo no es válido"),
    validarCampos,
  ],
  obtenerCalendarioSep
);

module.exports = router;
