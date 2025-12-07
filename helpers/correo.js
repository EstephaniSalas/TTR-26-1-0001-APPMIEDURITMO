const sgMail = require('@sendgrid/mail');

// Configurar API Key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const enviarCorreo = async (correoUsuario, nombre, codigo) => {
    try {
        console.log('=== ENVIANDO CON SENDGRID ===');
        console.log('Destinatario:', correoUsuario);
        
        // DETECTAR PROVEEDOR DE EMAIL
        const esMicrosoft = correoUsuario.toLowerCase().includes('@outlook') || 
                           correoUsuario.toLowerCase().includes('@hotmail') ||
                           correoUsuario.toLowerCase().includes('@live');
        
        // CONFIGURACIÓN ESPECÍFICA PARA MICROSOFT
        let configEmail;
        if (esMicrosoft) {
            console.log('📧 Usando configuración especial para Microsoft...');
            configEmail = {
                fromEmail: 'noreply@sendgrid.me',  // Dominio autenticado de SendGrid
                fromName: 'Mi EduRitmo',
                replyTo: 'soporte@sendgrid.me',
                priority: 'high',
                tracking: false
            };
        } else {
            configEmail = {
                fromEmail: 'estephani.saor@gmail.com',
                fromName: 'Mi EduRitmo',
                replyTo: 'estephani.saor@gmail.com',
                priority: 'normal',
                tracking: true
            };
        }
        
        const msg = {
            to: correoUsuario,
            from: {
                email: configEmail.fromEmail,
                name: configEmail.fromName
            },
            replyTo: configEmail.replyTo,
            subject: 'Código de verificación para cambiar contraseña',
            html: `
                <!DOCTYPE html>
                <html lang="es">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Código de Verificación</title>
                    <style>
                        body {
                            font-family: 'Arial', sans-serif;
                            line-height: 1.6;
                            color: #333;
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                            background-color: #f9f9f9;
                        }
                        .container {
                            background-color: #ffffff;
                            border-radius: 10px;
                            padding: 30px;
                            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                            margin-top: 20px;
                        }
                        .header {
                            text-align: center;
                            margin-bottom: 30px;
                        }
                        .logo {
                            max-width: 150px;
                            margin-bottom: 20px;
                        }
                        .title {
                            color: #2c3e50;
                            font-size: 24px;
                            margin-bottom: 10px;
                        }
                        .greeting {
                            color: #34495e;
                            font-size: 18px;
                            margin-bottom: 20px;
                        }
                        .code-container {
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                            border-radius: 8px;
                            padding: 25px;
                            text-align: center;
                            margin: 30px 0;
                            color: white;
                        }
                        .code {
                            font-size: 42px;
                            font-weight: bold;
                            letter-spacing: 8px;
                            font-family: 'Courier New', monospace;
                            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
                        }
                        .message {
                            font-size: 16px;
                            margin-bottom: 25px;
                            color: #555;
                        }
                        .warning {
                            background-color: #fff3cd;
                            border: 1px solid #ffeaa7;
                            border-radius: 5px;
                            padding: 15px;
                            margin: 20px 0;
                            color: #856404;
                        }
                        .footer {
                            text-align: center;
                            margin-top: 30px;
                            padding-top: 20px;
                            border-top: 1px solid #eee;
                            color: #7f8c8d;
                            font-size: 14px;
                        }
                        .button {
                            display: inline-block;
                            background-color: #3498db;
                            color: white;
                            padding: 12px 30px;
                            text-decoration: none;
                            border-radius: 5px;
                            font-weight: bold;
                            margin-top: 15px;
                        }
                        .info-box {
                            background-color: #f8f9fa;
                            border-left: 4px solid #3498db;
                            padding: 15px;
                            margin: 20px 0;
                        }
                        @media only screen and (max-width: 600px) {
                            .container {
                                padding: 20px;
                            }
                            .code {
                                font-size: 32px;
                                letter-spacing: 6px;
                            }
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1 class="title">🔐 Mi EduRitmo</h1>
                            <h2 class="greeting">Hola ${nombre},</h2>
                        </div>
                        
                        <div class="message">
                            <p>Has solicitado restablecer tu contraseña en <strong>Mi EduRitmo</strong>.</p>
                            <p>Para completar el proceso, utiliza el siguiente código de verificación:</p>
                        </div>
                        
                        <div class="code-container">
                            <div class="code">${codigo}</div>
                        </div>
                        
                        <div class="info-box">
                            <p>💡 <strong>Instrucciones:</strong></p>
                            <p>1. Copia el código de arriba</p>
                            <p>2. Regresa a la aplicación Mi EduRitmo</p>
                            <p>3. Ingresa el código en el campo correspondiente</p>
                            <p>4. Establece tu nueva contraseña</p>
                        </div>
                        
                        <div class="warning">
                            ⚠️ <strong>Importante:</strong>
                            <p>• Este código es válido por <strong>15 minutos</strong></p>
                            <p>• No compartas este código con nadie</p>
                            <p>• Si no solicitaste este cambio, ignora este correo</p>
                        </div>
                        
                        <div class="message">
                            <p>Si tienes problemas con el código o necesitas ayuda, no dudes en contactarnos.</p>
                        </div>
                        
                        <div class="footer">
                            <p>Saludos,<br>
                            <strong>El equipo de Mi EduRitmo</strong></p>
                            <p style="font-size: 12px; margin-top: 20px; color: #95a5a6;">
                                Este es un correo automático, por favor no responder directamente.<br>
                                Si necesitas asistencia, contáctanos a través de la aplicación.
                            </p>
                        </div>
                    </div>
                </body>
                </html>
            `,
            text: `Hola ${nombre},

Has solicitado cambiar tu contraseña en Mi EduRitmo.

Tu código de verificación es: ${codigo}

Este código es válido por 15 minutos.

Instrucciones:
1. Copia el código de arriba
2. Regresa a la aplicación Mi EduRitmo
3. Ingresa el código en el campo correspondiente
4. Establece tu nueva contraseña

IMPORTANTE:
• Este código es válido por 15 minutos
• No compartas este código con nadie
• Si no solicitaste este cambio, ignora este correo

Saludos,
El equipo de Mi EduRitmo

---
Este es un correo automático, por favor no responder directamente.
Si necesitas asistencia, contáctanos a través de la aplicación.`,
            
            // CONFIGURACIÓN ESPECIAL PARA MICROSOFT
            headers: esMicrosoft ? {
                'X-Priority': '1',
                'X-MSMail-Priority': 'High',
                'Importance': 'High',
                'X-Mailer': 'Mi EduRitmo',
                'Precedence': 'bulk'
            } : {},
            
            mailSettings: {
                sandboxMode: { enable: false }
            },
            
            trackingSettings: {
                clickTracking: { enable: configEmail.tracking },
                openTracking: { enable: configEmail.tracking }
            }
        };

        // DELAY MÁS LARGO PARA MICROSOFT
        if (esMicrosoft) {
            console.log('⏳ Aplicando delay de 3 segundos para Microsoft...');
            await new Promise(resolve => setTimeout(resolve, 3000));
        }

        console.log(`🚀 Enviando con remitente: ${configEmail.fromEmail}`);
        const response = await sgMail.send(msg);
        
        console.log('✅ Correo enviado con SendGrid');
        console.log('Message ID:', response[0].headers['x-message-id']);
        
        return response;
    } catch (error) {
        console.error('❌ ERROR:', error.message);
        throw error;
    }
};

const generarCodigoVerificacion = () => {
    const codigo = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('🔢 Código generado:', codigo);
    return codigo;
};

// Función de prueba mejorada
const probarSendGrid = async (emailTest = null) => {
    try {
        console.log('🧪 Probando configuración SendGrid...');
        
        // Verificar API Key
        if (!process.env.SENDGRID_API_KEY) {
            console.error('❌ SENDGRID_API_KEY no está definida');
            return false;
        }
        
        if (!process.env.SENDGRID_API_KEY.startsWith('SG.')) {
            console.error('❌ API Key debe comenzar con "SG."');
            return false;
        }
        
        console.log('✅ API Key configurada correctamente');
        
        // Si se proporciona un email, enviar prueba
        if (emailTest) {
            console.log('📧 Enviando correo de prueba a:', emailTest);
            const codigoTest = generarCodigoVerificacion();
            await enviarCorreo(emailTest, 'Usuario de Prueba', codigoTest);
            console.log('✅ Correo de prueba enviado exitosamente');
        }
        
        return true;
    } catch (error) {
        console.error('❌ Error en prueba SendGrid:', error.message);
        return false;
    }
};

// Función para verificar configuración al iniciar
const verificarConfiguracion = () => {
    console.log('🔍 Verificando configuración de correo...');
    console.log('SENDGRID_API_KEY existe?:', !!process.env.SENDGRID_API_KEY);
    console.log('Longitud API Key:', process.env.SENDGRID_API_KEY ? process.env.SENDGRID_API_KEY.length : 'N/A');
    console.log('NODE_ENV:', process.env.NODE_ENV || 'development');
};

// Ejecutar verificación al cargar el módulo
verificarConfiguracion();

module.exports = {
    enviarCorreo,
    generarCodigoVerificacion,
    probarSendGrid,
    verificarConfiguracion
};