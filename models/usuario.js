const { Schema, model } = require('mongoose');

const UsuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    correo: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    tareas: {
        type: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Tarea'
            }
        ],
    },
    notas: {
        type: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Nota'
            }
        ],
    },
    materias: {
        type: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Materia'
            }
        ],
    },
    flashcards: {
        type: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Flashcard'
            }
        ],
    },
    eventos: {
        type: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Evento'
            }
        ],
    },
    codigoVerificacion: {
        type: String,
        default: null
    },
    expiracionCodigo: {
        type: Date,
        default: null
    },
    intentosCodigo: {
        type: Number,
        default: 0
    },
    estado: { 
        type: Boolean, 
        default: true 
    },
});

UsuarioSchema.methods.toJSON = function(){
  const {__v,password,_id,codigoVerificacion,expiracionCodigo,intentosCodigo, ...usuario } = this.toObject();
  usuario.uid=_id;    
  return usuario; 
}

module.exports = model('Usuario', UsuarioSchema);
