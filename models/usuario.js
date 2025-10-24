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
    password2: {
        type: String,
        required: [true, 'La confirmación de contraseña es obligatoria']
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
    }
});

UsuarioSchema.methods.toJSON = function(){
  const {__v,_id, ...usuario } = this.toObject();
  usuario.uid=_id;    
  return usuario; 
}

UsuarioSchema.methods.toJSON = function() {
    const {password, password2,__v, ...usaurio} = this.toObject();
    return usaurio;
}

module.exports = model('Usuario', UsuarioSchema);
