const { Schema, model } = require("mongoose");

const TareaSchema = new Schema({
  usuario: {
    type: Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  },
  nombreTarea: {
    type: String,
    required: true,
  },
  materiaTarea: {
    type: Schema.Types.ObjectId,
    ref: "Materia",
    required: false,
  },
  descripcionMateria: {
    type: String,
    required: false,
  },
  tipoTarea: {
    type: String, //Tarea, Proyecto, Examen
    required: false,
  },
  fechaEntregaTarea: {
    type: String,
    required: true,
  },
  horaEntregaTarea: {
    type: String,
    required: true,
  },
  prioridadTarea: {
    type: Boolean,
    required: false,
  },
  estatusTarea: {
    type: String,
    enum: ["Pendiente", "Completada"],
    default: "Pendiente",
  },
});

// Método para personalizar el JSON de respuesta
TareaSchema.methods.toJSON = function () {
  const { __v, _id, ...tarea } = this.toObject();
  tarea.uid = _id;
  return tarea;
};

module.exports = model("Tarea", TareaSchema);
