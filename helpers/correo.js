const nodeMailer = require('nodemailer');

const configuracionCorreo = nodeMailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.CORREOMIEDURITMO,
        pass: process.env.PASSCORREOMIEDURITMO,
    }
});

const enviarCorreo = async (correoUsuario, nombre, codigo) => {
    try{
        const cuerpoCorreo = {
            from: process.env.CORREOMIEDURITMO,  
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
            `
        };

        await configuracionCorreo.sendMail(cuerpoCorreo);
        console.log('Correo enviado correctamente a:', correoUsuario);
    } catch (error) {
        console.error('Error al enviar el correo:', error);
        throw new Error('No se pudo enviar el correo de verificación');
    }   
};

const generarCodigoVerificacion = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

module.exports = {
    enviarCorreo,
    generarCodigoVerificacion
};