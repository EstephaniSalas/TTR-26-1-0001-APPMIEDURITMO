const { Schema, model } = require("mongoose");

const CalendarioSepSchema = new Schema(
  {
    ciclo: {
      type: String,
      required: true,        // Ej: "2025-2026"
      index: true,
    },
    fecha: {
      type: Date,
      required: true,
      index: true,
    },
    tipo: {
      type: String,
      required: true,
      enum: [
        "DIA_FESTIVO",
        "SUSPENSION_CLASES",
        "VACACIONES",
      ],
    },
    descripcion: {
      type: String,
      required: true,
    },
    esHabil: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

CalendarioSepSchema.index(
  { ciclo: 1, fecha: 1 },
  { unique: true }
);

CalendarioSepSchema.methods.toJSON = function () {
  const { __v, _id, ...evento } = this.toObject();
  evento.uid = _id;
  return evento;
};

module.exports = model("CalendarioSep", CalendarioSepSchema);
