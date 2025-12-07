const nodeMailer = require('nodemailer');

// Configuración mejorada para Railway/producción
const configuracionCorreo = nodeMailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true para 465, false para otros puertos
    auth: {
        user: process.env.CORREOMIEDURITMO,
        pass: process.env.PASSCORREOMIEDURITMO,
    },
    tls: {
        rejectUnauthorized: false // IMPORTANTE para Railway
    },
    connectionTimeout: 10000, // 10 segundos timeout
    greetingTimeout: 10000,
    socketTimeout: 10000
});

// Verificar la conexión al inicio de la app
configuracionCorreo.verify(function(error, success) {
    if (error) {
        console.log('❌ Error configurando correo:', error.message);
        console.log('Código de error:', error.code);
        console.log('Comando:', error.command);
    } else {
        console.log('✅ Servidor de correo listo');
        console.log('📧 Usuario:', process.env.CORREOMIEDURITMO ? 'Configurado' : 'NO configurado');
        console.log('🔑 Contraseña:', process.env.PASSCORREOMIEDURITMO ? 'Configurada' : 'NO configurada');
    }
});

const enviarCorreo = async (correoUsuario, nombre, codigo) => {
    try {
        // Log de depuración
        console.log('=== INTENTANDO ENVIAR CORREO ===');
        console.log('Destinatario:', correoUsuario);
        console.log('Nombre:', nombre);
        console.log('Código:', codigo);
        console.log('Desde:', process.env.CORREOMIEDURITMO);
        console.log('Entorno:', process.env.NODE_ENV || 'development');
        
        const cuerpoCorreo = {
            from: `"Mi EduRitmo" <${process.env.CORREOMIEDURITMO}>`,  
            to: correoUsuario,
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
            // Añadir texto plano como fallback
            text: `Hola ${nombre},\n\nTu código de verificación es: ${codigo}\n\nEste código expirará en 15 minutos.\n\nSaludos,\nEl equipo de Mi EduRitmo`
        };

        // Enviar el correo
        const info = await configuracionCorreo.sendMail(cuerpoCorreo);
        
        console.log('✅ Correo enviado correctamente a:', correoUsuario);
        console.log('ID del mensaje:', info.messageId);
        console.log('Respuesta del servidor:', info.response);
        
        return info;
    } catch (error) {
        console.error('❌ ERROR AL ENVIAR CORREO:');
        console.error('Mensaje:', error.message);
        console.error('Código:', error.code);
        console.error('Comando:', error.command);
        console.error('Stack completo:', error.stack);
        
        // Mensaje más amigable según el error
        let mensajeError = 'No se pudo enviar el correo de verificación';
        
        if (error.code === 'EAUTH') {
            mensajeError = 'Error de autenticación. Verifica las credenciales del correo.';
        } else if (error.code === 'ECONNECTION') {
            mensajeError = 'Error de conexión con el servidor de correo.';
        } else if (error.code === 'ETIMEDOUT') {
            mensajeError = 'Tiempo de espera agotado. Intenta nuevamente.';
        }
        
        throw new Error(mensajeError);
    }   
};

const generarCodigoVerificacion = () => {
    const codigo = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('🔢 Código generado:', codigo);
    return codigo;
}

// Función de prueba para verificar configuración
const probarConfiguracionCorreo = async () => {
    try {
        console.log('🧪 Probando configuración de correo...');
        await configuracionCorreo.verify();
        console.log('✅ Configuración de correo OK');
        return true;
    } catch (error) {
        console.error('❌ Error en configuración de correo:', error.message);
        return false;
    }
}

module.exports = {
    enviarCorreo,
    generarCodigoVerificacion,
    probarConfiguracionCorreo,
    configuracionCorreo // Exportar para pruebas
};