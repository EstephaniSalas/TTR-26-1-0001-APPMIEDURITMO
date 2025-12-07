// correo.js - VERSIÓN CORRECTA
const emailjs = require('emailjs-com');

// Función para enviar correo con EmailJS
const enviarCorreo = async (correoUsuario, nombre, codigo) => {
    try {
        console.log('📧 Enviando con EmailJS...');
        console.log('Destinatario:', correoUsuario);
        console.log('Nombre:', nombre);
        console.log('Código:', codigo);
        
        const templateParams = {
            to_email: correoUsuario,
            to_name: nombre,
            from_name: 'Mi EduRitmo',
            codigo: codigo,
            nombre: nombre
        };
        
        console.log('🔑 Service ID:', process.env.EMAILJS_SERVICE_ID ? 'Configurado' : 'NO configurado');
        console.log('🔑 Template ID:', process.env.EMAILJS_TEMPLATE_ID ? 'Configurado' : 'NO configurado');
        
        const response = await emailjs.send(
            process.env.EMAILJS_SERVICE_ID,
            process.env.EMAILJS_TEMPLATE_ID,
            templateParams,
            process.env.EMAILJS_PUBLIC_KEY
        );
        
        console.log('✅ Correo enviado con EmailJS');
        console.log('Status:', response.status);
        console.log('Text:', response.text);
        
        return response;
    } catch (error) {
        console.error('❌ ERROR EmailJS:');
        console.error('Mensaje:', error.message);
        console.error('Status:', error.status);
        console.error('Text:', error.text);
        
        // Fallback: mostrar código en consola
        console.log(`\n⚠️  CORREO NO ENVIADO - CÓDIGO ALTERNATIVO:`);
        console.log(`📧 ${correoUsuario}`);
        console.log(`🔢 ${codigo}`);
        console.log(`⏰ Válido por 15 minutos\n`);
        
        throw new Error(`No se pudo enviar el correo. Código: ${codigo}`);
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