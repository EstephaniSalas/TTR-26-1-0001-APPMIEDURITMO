const { Schema, model } = require("mongoose");

const FlashcardSchema = new Schema({
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
  delanteFlashcard: { // Cara delante de la carta: Concepto o pregunta
    type: String,
    required: true,
    trim: true,
  },
  reversoFlashcard: { // Reverso de la carta: Definición o respuesta 
    type: String,
    required: true,
    trim: true,
  },
});

// Método para personalizar el JSON de respuesta
FlashcardSchema.methods.toJSON = function () {
  const { __v, _id, ...flashcard } = this.toObject();
  flashcard.uid = _id;
  return flashcard;
};

module.exports = model("Flashcard", FlashcardSchema);
