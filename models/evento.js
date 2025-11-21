const { Schema, model } = require("mongoose");

const EventoSchema = new Schema({
  usuario: {
    type: Schema.Types.ObjectId,
    ref: "Usuario",
    required: true
  },

  tituloEvento: {
    type: String,
    required: true,
    trim: true
  },

  descripcionEvento: {
    type: String,
    trim: true,
    default: ""
  },

  fechaEvento: {
    type: Date,
    required: true
  },

  horaInicio: {
    type: String,
    required: true,
    trim: true
  },

  horaFin: {
    type: String,
    required: true,
    trim: true
  },

  importante: {
    type: Boolean,
    default: false
  }
});

EventoSchema.methods.toJSON = function () {
  const { __v, _id, ...evento } = this.toObject();
  evento.uid = _id;
  return evento;
};

module.exports = model("Evento", EventoSchema);
