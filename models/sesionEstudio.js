// models/sesionEstudio.js
const { Schema, model } = require("mongoose");

const SesionEstudioSchema = new Schema(
  {
    usuario: {
      type: Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
    materia: {
      type: Schema.Types.ObjectId,
      ref: "Materia",
      required: true,
    },
    // Día y hora en que se hizo el repaso
    fechaSesion: {
      type: Date,
      required: true,
      default: Date.now,
    },
    // Duración total de la sesión en segundos
    duracionSegundos: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  {
    timestamps: true,
  }
);

// Formato de respuesta
SesionEstudioSchema.methods.toJSON = function () {
  const { __v, _id, ...sesion } = this.toObject();
  sesion.uid = _id;
  return sesion;
};

module.exports = model("SesionEstudio", SesionEstudioSchema);
