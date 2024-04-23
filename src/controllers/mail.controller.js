import nodemailer from "nodemailer";
import { __dirname } from "../utils.js";
import dotenv from "dotenv";

dotenv.config();

export const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.APP_PASSWORD,
    },
  });

export async function sendConfirmationEmail(to, orderId, total) {
  try {
      const result = await transporter.sendMail({
          from: `Tienda <${process.env.EMAIL}>`,
          to: to, 
          subject: "Confirmación de tu compra",
          html: `<div><h1 style='color: red'>¡Gracias por tu compra!</h1><p>Tu pedido con ID ${orderId} por un total de $ ${total} ha sido procesado y en breve te lo estaremos enviando.</p><img src='cid:whisky' /></div>`,
          attachments: [
              {
                  filename: "whisky.jpg",
                  path: "./src/public/img/whisky.jpg",
                  cid: "whisky",
              }
          ]
      });
      console.log("Correo de confirmación enviado:", result);
  } catch (error) {
      console.error("Error al enviar el correo de confirmación:", error);
      throw error; 
  }
}

export async function sendPasswordResetEmail(to, link) {
  await transporter.sendMail({
      from: `Soporte <${process.env.EMAIL_SUPPORT}>`,
      to: to,
      subject: 'Instrucciones para restablecer tu contraseña',
      html: `<div><h1 style='color: gray'>Restablecer Contraseña</h1><p>Hola,<br><br>Recibimos una solicitud para restablecer tu contraseña. Por favor, haz clic en el siguiente enlace para establecer una nueva contraseña: <a href="${link}" style="font-size: 16px;">Restablecer Contraseña</a><br><br>Si no solicitaste esto, por favor ignora este correo electrónico.</p><br>Saludos,<br>Tu Equipo de Soporte<br><br> <img src='cid:whisky2' style='width: 800px; height: auto;' /></div>`,
      attachments: [
        {
            filename: "whiskyReset.webp",
            path: "./src/public/img/whiskyReset.webp",
            cid: "whisky2",
        }
    ]
  });
}

export async function sendWelcomeEmail(to, userName) {
  try {
      await transporter.sendMail({
          from: `Tienda <${process.env.EMAIL}>`,
          to: to,
          subject: "¡Bienvenido a La Tienda del Wihisky!",
          html: `<div>
                    <h1 style='color: #3478f7'>¡Hola, ${userName}!</h1>
                    <p>Estamos encantados de darte la bienvenida a La Tienda del Wihisky!!.</p>
                    <p>Para empezar, te recomendamos...</p>
                    <p>Si tienes alguna pregunta, no dudes a contactarnos en <a href="mailto:${process.env.EMAIL}">${process.env.EMAIL}</a>.</p>
                    <p>¡Gracias por unirte a nosotros y bienvenido a la familia!</p>
                    <img src='cid:welcomeImage' style='width: 100%; max-width: 600px; height: auto;' />
                </div>`,
          attachments: [
              {
                  filename: "welcomeImage.webp",
                  path: "./src/public/img/welcomeImage.webp",
                  cid: "welcomeImage",
              }
          ]
      });
      console.log("Correo de bienvenida enviado.");
  } catch (error) {
      console.error("Error al enviar el correo de bienvenida:", error);
      throw error;
  }
}

export const sendMail = async (req, res) => {
    let result = await transporter.sendMail({
      from: `Tienda <${process.env.EMAIL}>`,
      to: "gaboandriossi@gmail.com",
      subject: "Confirmaciòn de su compra",
      html: `<div><h1 style='color: red'>Hola, te confirmamos que recibimos tu pedido y esta siendo procesado</h1><img src='cid:whisky' /></div>`,
      attachments: [
        {
          filename: "whisky.jpg",
          path: `${__dirname}../../src/public/img/whisky.jpg`,
          cid: "whisky",
        },
      ],
    });
    res.json({ status: "success", result });
  };

