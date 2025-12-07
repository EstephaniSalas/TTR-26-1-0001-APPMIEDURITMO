// correo.js - VERSIÓN CORRECTA
// correo.js - VERSIÓN PARA NODE.JS
const EmailJS = require('@emailjs/nodejs');

const enviarCorreo = async (correoUsuario, nombre, codigo) => {
    try {
        console.log('📧 Enviando con EmailJS Node.js...');
        
        // Inicializar con tu Public Key
        EmailJS.init({
            publicKey: process.env.EMAILJS_PUBLIC_KEY,
            privateKey: process.env.EMAILJS_PRIVATE_KEY  // Opcional, para templates privados
        });
        
        const response = await EmailJS.send(
            process.env.EMAILJS_SERVICE_ID,
            process.env.EMAILJS_TEMPLATE_ID,
            {
                to_email: correoUsuario,
                to_name: nombre,
                from_name: 'Mi EduRitmo',
                codigo: codigo,
                nombre: nombre
            }
        );
        
        console.log('✅ Correo enviado con EmailJS');
        console.log('Response:', response);
        return response;
        
    } catch (error) {
        console.error('❌ ERROR EmailJS Node.js:', error);
        throw error;
    }
};

// Función para generar código
const generarCodigoVerificacion = () => {
    const codigo = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('🔢 Código generado:', codigo);
    return codigo;
};

// Solo UN module.exports al final
module.exports = {
    enviarCorreo,
    generarCodigoVerificacion
};