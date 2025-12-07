const { Router } = require("express");
const { check, query } = require("express-validator");

const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validar-jwt");

const {
  cargarCalendarioSep,
  obtenerEventosCalendario,
  obtenerEventosDia,
  obtenerCiclosCalendario,
} = require("../controllers/calendarioSep");

const router = Router();

/**
 * POST /api/calendario-sep/cargar
 * Carga/actualiza en bloque el calendario para un ciclo.
 * Protegido con JWT.
 */
router.post("/cargar", [
    validarJWT,
    check("ciclo", "El ciclo es obligatorio (ej. '2025-2026')").not().isEmpty(),
    check("eventos", "Debe enviar un arreglo 'eventos' con al menos un elemento").isArray({ min: 1 }),
    check("eventos.*.fecha", "Cada evento debe tener 'fecha' válida (YYYY-MM-DD)").not().isEmpty().isISO8601(),
    check("eventos.*.tipo", "Cada evento debe tener un 'tipo' válido").not().isEmpty()
      .isIn(["DIA_FESTIVO", "SUSPENSION_CLASES", "VACACIONES"]),
    check("eventos.*.descripcion", "Cada evento debe tener 'descripcion'").not().isEmpty(),
    validarCampos,
  ],
  cargarCalendarioSep
);

/**
 * GET /api/calendario-sep
 * Query:
 *   ciclo (opcional)
 *   desde (opcional, YYYY-MM-DD)
 *   hasta (opcional, YYYY-MM-DD)
 */
router.get("/", [validarJWT,
    query("desde").optional().isISO8601()
    .withMessage("El parámetro 'desde' debe ser una fecha válida (YYYY-MM-DD)"),
    query("hasta").optional().isISO8601()
      .withMessage("El parámetro 'hasta' debe ser una fecha válida (YYYY-MM-DD)"),
    validarCampos,
  ],
  obtenerEventosCalendario
);

/**
 * GET /api/calendario-sep/dia
 * Query:
 *   fecha (obligatorio, YYYY-MM-DD)
 *   ciclo (opcional)
 */
router.get("/dia",[
    validarJWT,
    query("fecha").not().isEmpty()
      .withMessage("El parámetro 'fecha' es obligatorio").isISO8601()
      .withMessage("El parámetro 'fecha' debe ser una fecha válida (YYYY-MM-DD)"),
    validarCampos,
  ],
  obtenerEventosDia
);

/**
 * GET /api/calendario-sep/ciclos
 * Devuelve los ciclos distintos cargados.
 */
router.get("/ciclos",
  [validarJWT],
  obtenerCiclosCalendario
);

module.exports = router;
