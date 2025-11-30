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
    ref: "Materia"
  },
  descripcionTarea: {
    type: String,
    default: ""
  },
  tipoTarea: {
    type: String,
    enum: ["Tarea", "Proyecto", "Examen"],
    default: "Tarea"
  },
  fechaEntregaTarea: {
    type: Date,
    required: true
  },
  horaEntregaTarea: {
    type: String,
    required: true
  },
  estatusTarea: {
    type: String,
    enum: ["Pendiente", "Completada", "Vencida"],
    default: "Pendiente"
  }
});

// Método para personalizar la salida JSON
TareaSchema.methods.toJSON = function () {
  const { __v, _id, ...tarea } = this.toObject();
  tarea.uid = _id;
  return tarea;
};

module.exports = model("Tarea", TareaSchema);