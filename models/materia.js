const { Schema, model } = require("mongoose");

const MateriaSchema = new Schema({
  usuario: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true,
  },
  nombreMateria: {
    type: String,
    required: true,
  },
  profesorMateria: {
    type: String,
    required: false,
  },
  edificioMateria: {
    type: String,
    required: false,
  },
  salonMateria: {
    type: String,
    required: false,
  },
  diasMateria: {
    type: [String],
    required: true,
  },
  horaInicioMateria: {
    type: String,
    required: true
  },
    horaFinMateria: {
    type: String,
    required: true
  },
});

// Método para personalizar el JSON de respuesta
MateriaSchema.methods.toJSON = function() {
  const { __v, _id, ...materia } = this.toObject();
  materia.uid = _id;
  return materia;
}

module.exports = model("Materia", MateriaSchema);
