const { Schema, model } = require("mongoose");

const NotaSchema = new Schema({
  usuario: {
    type: Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  },
  nombreNota:{
    type: String,
    required: true,
  },
  contenidoNota:{
    type: String,
    required: false,
  },
});

// Método para personalizar el JSON de respuesta
NotaSchema.methods.toJSON = function () {
  const { __v, _id, ...nota } = this.toObject();
  nota.uid = _id;
  return nota;
};

module.exports = model("Nota", NotaSchema);
