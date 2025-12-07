const sgMail = require('@sendgrid/mail');

// Configurar API Key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const enviarCorreo = async (correoUsuario, nombre, codigo) => {
    try {
        console.log('=== ENVIANDO CON SENDGRID ===');
        console.log('Destinatario:', correoUsuario);
        console.log('Es Outlook/Hotmail?:', correoUsuario.includes('@outlook') || correoUsuario.includes('@hotmail'));
        
        const msg = {
            to: correoUsuario,
            from: {
                email: 'estephani.saor@gmail.com',
                name: 'Mi EduRitmo'
            },
            replyTo: 'estephani.saor@gmail.com', // IMPORTANTE para Outlook
            subject: 'Código de verificación para cambiar contraseña',
            html: `...tu HTML...`,
            text: `...tu texto...`,
            // Configuraciones importantes para deliverability
            mailSettings: {
                sandboxMode: {
                    enable: false // Asegúrate que esté en false
                }
            },
            // Categoría para tracking (opcional)
            categories: ['password-reset', 'verification'],
            // Headers personalizados
            headers: {
                'X-Priority': '1',
                'X-MSMail-Priority': 'High',
                'Importance': 'High'
            },
            // Configuración de click tracking (deshabilitar puede ayudar)
            trackingSettings: {
                clickTracking: {
                    enable: false
                },
                openTracking: {
                    enable: false
                }
            }
        };

        const response = await sgMail.send(msg);
        console.log('✅ Correo enviado con SendGrid');
        console.log('Status Code:', response[0].statusCode);
        console.log('Message ID:', response[0].headers['x-message-id']);
        
        return response;
    } catch (error) {
        console.error('❌ ERROR SENDGRID:', error.message);
        throw error;
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