import nodemailer from "nodemailer";
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
      html: `Hola,<br><br>Recibimos una solicitud para restablecer tu contraseña. Por favor, haz clic en el siguiente enlace para establecer una nueva contraseña: <a href="${link}">Restablecer Contraseña</a><br><br>Si tú no solicitaste esto, por favor ignora este correo electrónico.<br><br>Saludos,<br>Tu Equipo de Soporte`
  });
}
