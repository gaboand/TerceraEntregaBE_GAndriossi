import express from "express";
import {transporter} from "../controllers/mail.controller.js";
import { __dirname } from "../utils.js";

const mailRouter = express.Router();

mailRouter.get("/mail", async (req, res) => {
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
  });

  export default mailRouter;