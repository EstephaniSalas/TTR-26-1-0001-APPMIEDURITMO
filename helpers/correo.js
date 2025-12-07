const sgMail = require('@sendgrid/mail');

// Configurar API Key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const enviarCorreo = async (correoUsuario, nombre, codigo) => {
    try {
        console.log('=== ENVIANDO CON SENDGRID ===');
        console.log('Destinatario:', correoUsuario);
        console.log('Nombre:', nombre);
        console.log('Código:', codigo);
        console.log('API Key configurada:', process.env.SENDGRID_API_KEY ? 'Sí' : 'No');
        
        const msg = {
            to: correoUsuario,
            from: {
                email: process.env.CORREOMIEDURITMO || 'estephani.saor@gmail.com',
                name: 'Mi EduRitmo'
            },
            subject: 'Código de verificación para cambiar contraseña',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">Hola ${nombre},</h2>
                <p>Has solicitado cambiar tu contraseña. Usa el siguiente código para verificar:</p>
                <div style="background-color: #f4f4f4; padding: 15px; text-align: center; margin: 20px 0;">
                    <h1 style="color: #007bff; margin: 0; font-size: 32px;">${codigo}</h1>
                </div>
                <p>Este código expirará en 15 minutos.</p>
                <p>Si no solicitaste este cambio, por favor ignora este correo.</p>
                <br>
                <p>Saludos,<br>El equipo de Mi EduRitmo</p>
                </div>
            `,
            text: `Hola ${nombre},\n\nTu código de verificación es: ${codigo}\n\nEste código expirará en 15 minutos.\n\nSaludos,\nEl equipo de Mi EduRitmo`
        };

        const response = await sgMail.send(msg);
        console.log('✅ Correo enviado con SendGrid');
        console.log('Status Code:', response[0].statusCode);
        console.log('Headers:', response[0].headers);
        
        return response;
    } catch (error) {
        console.error('❌ ERROR SENDGRID:');
        console.error('Mensaje:', error.message);
        if (error.response) {
            console.error('Respuesta error:', error.response.body);
        }
        throw new Error('No se pudo enviar el correo de verificación');
    }
};

const generarCodigoVerificacion = () => {
    const codigo = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('🔢 Código generado:', codigo);
    return codigo;
};

// Función de prueba
const probarSendGrid = async () => {
    try {
        console.log('🧪 Probando SendGrid...');
        // SendGrid no tiene verify(), hacemos una prueba simple
        return !!process.env.SENDGRID_API_KEY;
    } catch (error) {
        console.error('❌ Error SendGrid:', error.message);
        return false;
    }
};

module.exports = {
    enviarCorreo,
    generarCodigoVerificacion,
    probarSendGrid
};