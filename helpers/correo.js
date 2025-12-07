// correo-emailjs.js
const emailjs = require('emailjs-com');

const enviarCorreoEmailJS = async (correoUsuario, nombre, codigo) => {
    try {
        console.log('📧 Enviando con EmailJS...');
        
        const templateParams = {
            to_email: correoUsuario,
            to_name: nombre,
            from_name: 'Mi EduRitmo',
            codigo: codigo,
            nombre: nombre
        };
        
        const response = await emailjs.send(
            process.env.EMAILJS_SERVICE_ID,
            process.env.EMAILJS_TEMPLATE_ID,
            templateParams,
            process.env.EMAILJS_PUBLIC_KEY
        );
        
        console.log('✅ Correo enviado con EmailJS');
        return response;
    } catch (error) {
        console.error('❌ Error EmailJS:', error);
        throw error;
    }
};

module.exports = { enviarCorreoEmailJS };