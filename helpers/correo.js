// correo.js - VERSIÓN FINAL CON SMTP2GO
const nodemailer = require('nodemailer');

const enviarCorreo = async (correoUsuario, nombre, codigo) => {
    try {
        console.log('🚀 Iniciando envío de correo...');
        console.log('📧 Para:', correoUsuario);
        console.log('👤 Nombre:', nombre);
        console.log('🔢 Código:', codigo);
        
        // 1. VERIFICAR CREDENCIALES
        if (!process.env.SMTP2GO_USERNAME || !process.env.SMTP2GO_PASSWORD) {
            console.error('❌ ERROR: Credenciales SMTP2GO no configuradas');
            console.log('⚠️  Variables necesarias en Railway:');
            console.log('   SMTP2GO_USERNAME=tu_usuario');
            console.log('   SMTP2GO_PASSWORD=tu_password');
            console.log('   SMTP2GO_FROM=estephani.saor@gmail.com');
            throw new Error('Configuración SMTP incompleta');
        }
        
        // 2. CONFIGURAR SMTP2GO
        const transporter = nodemailer.createTransport({
            host: 'mail.smtp2go.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.SMTP2GO_USERNAME,
                pass: process.env.SMTP2GO_PASSWORD
            },
            tls: {
                rejectUnauthorized: false
            },
            connectionTimeout: 10000,
            greetingTimeout: 10000,
            socketTimeout: 10000
        });
        
        // 3. VERIFICAR CONEXIÓN
        console.log('🔌 Verificando conexión SMTP2GO...');
        await transporter.verify();
        console.log('✅ Conexión SMTP2GO verificada');
        
        // 4. CREAR HTML DEL CORREO
        const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <style>
                body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px; text-align: center; color: white; border-radius: 10px 10px 0 0; }
                .content { background: #fff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                .code { font-size: 42px; font-weight: bold; color: #007bff; text-align: center; letter-spacing: 8px; font-family: 'Courier New', monospace; margin: 25px 0; }
                .warning { background: #fff3cd; padding: 15px; border-radius: 6px; margin: 20px 0; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1 style="margin: 0;">📚 Mi EduRitmo</h1>
                <p style="margin: 5px 0 0;">Tu plataforma educativa personalizada</p>
            </div>
            
            <div class="content">
                <h2 style="color: #2c3e50;">Hola ${nombre},</h2>
                
                <p style="color: #555;">
                    Has solicitado restablecer tu contraseña. 
                    Usa el siguiente código para verificar tu identidad:
                </p>
                
                <div class="code">${codigo}</div>
                
                <div style="text-align: center; color: #6c757d; margin-bottom: 20px;">
                    ⏰ <strong>Válido por 15 minutos</strong>
                </div>
                
                <div class="warning">
                    <strong>⚠️ Importante:</strong>
                    <p>• No compartas este código con nadie</p>
                    <p>• Si no solicitaste este cambio, ignora este correo</p>
                    <p>• El código expirará automáticamente</p>
                </div>
                
                <p style="color: #666;">
                    Saludos,<br>
                    <strong>El equipo de Mi EduRitmo</strong>
                </p>
            </div>
        </body>
        </html>
        `;
        
        // 5. CONFIGURAR MENSAJE
        const mailOptions = {
            from: `"Mi EduRitmo" <${process.env.SMTP2GO_FROM || 'estephani.saor@gmail.com'}>`,
            to: correoUsuario,
            subject: 'Tu código de verificación - Mi EduRitmo',
            html: htmlContent,
            text: `Hola ${nombre},\n\nTu código de verificación es: ${codigo}\n\nVálido por 15 minutos.\n\nSaludos,\nEl equipo de Mi EduRitmo`,
            headers: {
                'X-Priority': '1',
                'Importance': 'High',
                'X-Mailer': 'MiEduRitmo'
            }
        };
        
        // 6. ENVIAR CORREO
        console.log('📤 Enviando correo...');
        const info = await transporter.sendMail(mailOptions);
        
        console.log('✅ CORREO ENVIADO EXITOSAMENTE');
        console.log('📫 Message ID:', info.messageId);
        console.log('📧 Respuesta:', info.response);
        
        return info;
        
    } catch (error) {
        console.error('❌ ERROR AL ENVIAR CORREO:');
        console.error('Mensaje:', error.message);
        console.error('Código:', error.code);
        
        // FALLBACK AMIGABLE
        console.log(`\n⚠️  MODO FALLBACK ACTIVADO`);
        console.log(`📧 Correo destino: ${correoUsuario}`);
        console.log(`👤 Nombre: ${nombre}`);
        console.log(`🔢 CÓDIGO PARA USAR: ${codigo}`);
        console.log(`⏰ Válido por 15 minutos`);
        console.log(`💡 En desarrollo, usa este código directamente\n`);
        
        // En desarrollo, podrías retornar el código
        if (process.env.NODE_ENV === 'development') {
            return { 
                fallback: true, 
                codigo: codigo,
                mensaje: 'En desarrollo - código disponible en logs'
            };
        }
        
        throw new Error('No se pudo enviar el correo. Por favor intenta nuevamente.');
    }
};

const generarCodigoVerificacion = () => {
    const codigo = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('🔢 Código generado:', codigo);
    return codigo;
};

// Verificar configuración al cargar
console.log('🔍 Verificando configuración de correo...');
console.log('SMTP2GO_USERNAME:', process.env.SMTP2GO_USERNAME ? '✅ Configurado' : '❌ NO configurado');
console.log('SMTP2GO_PASSWORD:', process.env.SMTP2GO_PASSWORD ? '✅ Configurado' : '❌ NO configurado');
console.log('SMTP2GO_FROM:', process.env.SMTP2GO_FROM || 'estephani.saor@gmail.com');

module.exports = {
    enviarCorreo,
    generarCodigoVerificacion
    
};