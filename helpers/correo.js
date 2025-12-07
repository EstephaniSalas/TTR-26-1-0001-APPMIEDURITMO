// correo.js - VERSIÓN FINAL CON RESEND
const { Resend } = require('resend');

// Inicializar Resend
const resend = new Resend(process.env.RESEND_API_KEY);

const enviarCorreo = async (correoUsuario, nombre, codigo) => {
    try {
        console.log('📧 Enviando con Resend...');
        console.log('Destinatario:', correoUsuario);
        console.log('Proveedor:', detectarProveedor(correoUsuario));
        
        const { data, error } = await resend.emails.send({
            from: 'Mi EduRitmo <onboarding@resend.dev>',
            to: correoUsuario,
            subject: 'Código de verificación para Mi EduRitmo',
            html: crearHTML(nombre, codigo),
            text: crearTextoPlano(nombre, codigo),
            headers: {
                'X-Priority': '1',
                'Importance': 'high'
            }
        });

        if (error) {
            console.error('❌ Error Resend:', error);
            throw error;
        }
        
        console.log('✅ Correo enviado con Resend');
        console.log('ID:', data.id);
        return data;
        
    } catch (error) {
        console.error('❌ ERROR GENERAL:', error.message);
        
        // Fallback: Mostrar código en logs para desarrollo
        console.log(`\n⚠️  CORREO NO ENVIADO - CÓDIGO ALTERNATIVO:`);
        console.log(`🔢 ${codigo} para ${correoUsuario}`);
        console.log(`⏰ Válido por 15 minutos\n`);
        
        throw new Error('No se pudo enviar el correo electrónico. Por favor intenta nuevamente.');
    }
};

// Helper functions
function detectarProveedor(email) {
    email = email.toLowerCase();
    if (email.includes('@outlook') || email.includes('@hotmail') || email.includes('@live')) {
        return 'Microsoft';
    } else if (email.includes('@gmail')) {
        return 'Google';
    } else {
        return 'Otro';
    }
}

function crearHTML(nombre, codigo) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
            .container { background: #fff; padding: 30px; border-radius: 10px; }
            .code { font-size: 32px; font-weight: bold; color: #007bff; text-align: center; margin: 20px 0; }
            .warning { background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <h2>Hola ${nombre},</h2>
            <p>Tu código de verificación para Mi EduRitmo es:</p>
            <div class="code">${codigo}</div>
            <p>Este código es válido por 15 minutos.</p>
            <div class="warning">
                <strong>⚠️ Importante:</strong>
                <p>• No compartas este código con nadie</p>
                <p>• Si no solicitaste este cambio, ignora este correo</p>
            </div>
            <p>Saludos,<br>El equipo de Mi EduRitmo</p>
        </div>
    </body>
    </html>
    `;
}

function crearTextoPlano(nombre, codigo) {
    return `Hola ${nombre},

Tu código de verificación para Mi EduRitmo es: ${codigo}

Este código es válido por 15 minutos.

IMPORTANTE:
• No compartas este código con nadie
• Si no solicitaste este cambio, ignora este correo

Saludos,
El equipo de Mi EduRitmo`;
}

const generarCodigoVerificacion = () => {
    const codigo = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('🔢 Código generado:', codigo);
    return codigo;
};

module.exports = {
    enviarCorreo,
    generarCodigoVerificacion
};