// models/calendarioSep.js
const { Schema, model } = require("mongoose");

/**
 * Calendario SEP oficial (ciclo escolar).
 *
 * Ejemplo de documento:
 * {
 *   ciclo: "2024-2025",
 *   fecha: 2024-09-16T00:00:00.000Z,
 *   tipo: "SUSPENSION",
 *   descripcion: "Suspensión por Independencia de México",
 *   esNoLaborable: true
 * }
 */
const CalendarioSepSchema = new Schema(
  {
    ciclo: {
      type: String,
      required: true,
      trim: true,
    },
    fecha: {
      type: Date,
      required: true,
    },
    tipo: {
      type: String,
      enum: ["CLASES", "SUSPENSION", "VACACIONES", "PERIODO_EVALUACION", "OTRO"],
      required: true,
      uppercase: true,
      trim: true,
    },
    descripcion: {
      type: String,
      default: "",
      trim: true,
    },
    // Para marcar si ese día no hay clases (útil en Flutter)
    esNoLaborable: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

CalendarioSepSchema.methods.toJSON = function () {
  const { __v, _id, ...cal } = this.toObject();
  cal.uid = _id;
  return cal;
};

module.exports = model("CalendarioSep", CalendarioSepSchema);
