const { Schema, model } = require("mongoose");

const HorarioSchema = new Schema({
  dia: {
    type: String,
    enum: ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sábado", "Domingo"],
    required: true,
  },
  horaInicio: {
    type: String, // "14:00"
    required: true,
    trim: true,
  },
  horaFin: {
    type: String, // "16:00"
    required: true,
    trim: true,
  },
}, { _id: false });

const MateriaSchema = new Schema({
  usuario: {
    type: Schema.Types.ObjectId,
    ref: "Usuario",
    required: true
  },

  nombreMateria: {
    type: String,
    required: true,
    trim: true,
  },

  profesorMateria: {
    type: String,
    default: "",
    trim: true,
  },

  edificioMateria: {
    type: String,
    default: "",
    trim: true,
  },

  salonMateria: {
    type: String,
    default: "",
    trim: true,
  },

  // reemplaza diasMateria + horaInicioMateria + horaFinMateria
  horariosMateria: {
    type: [HorarioSchema],
    required: true,
    validate: {
      validator: (v) => Array.isArray(v) && v.length > 0,
      message: "Debe existir al menos un horario para la materia",
    },
  },
});

// Método para personalizar el JSON de respuesta
MateriaSchema.methods.toJSON = function () {
  const { __v, _id, ...materia } = this.toObject();
  materia.uid = _id;
  return materia;
};

module.exports = model("Materia", MateriaSchema);
