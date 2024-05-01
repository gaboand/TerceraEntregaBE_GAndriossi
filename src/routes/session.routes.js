import express from "express";
import {UserModel} from "../dao/mongo/models/user.model.js";;
import { createHash, isValidPassword, generateToken, passportCall, authorization } from "../utils.js";
import passport from "passport";
import {addLogger} from "../middlewares/logger.js";
import crypto from "crypto";
import { sendPasswordResetEmail, sendWelcomeEmail } from '../controllers/mail.controller.js';
import bcrypt from "bcrypt";
import authAdmin from "../middlewares/authAdmin.js";

const sessionRouter = express.Router();
sessionRouter.use(addLogger);


sessionRouter.post("/signup", async (req, res, next) => {
    req.logger.debug('Depurar');
    req.logger.http('Mensaje HTTP');
    req.logger.info('Mensaje informativo');
    req.logger.warn('Mensaje de advertencia');
    req.logger.error('Error detectado');
    req.logger.log('fatal', 'Alerta maxima');
    passport.authenticate("register", async (err, user, info) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (!user) {
        return res.status(400).json({ error: info.message });
      }
      try {
        await sendWelcomeEmail(user.email, user.first_name || "Usuario");
      } catch (error) {
        console.error("Error al enviar el correo de bienvenida:", error);
      }
      return res.status(200).json({ message: "Usuario creado con éxito. Correo de bienvenida enviado." });
    
    })(req, res, next);
  });
  
sessionRouter.post("/login", async (req, res) => {
  req.logger.debug('Depurar');
  req.logger.http('Mensaje HTTP');
  req.logger.info('Mensaje informativo');
  req.logger.warn('Mensaje de advertencia');
  req.logger.error('Error detectado');
  req.logger.log('fatal', 'Alerta maxima');
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });

  if (user === null) {
    res.status(400).json({
      error: "Usuario o contraseña incorrectos",
    });
  } else if (!isValidPassword(user.password, password)) {
    res.status(401).json({
      error: "Usuario o contraseña incorrectos",
    });
  } else {

    req.login(user, function(err) {
      if (err) { return next(err); }
      req.session.user = email;
      req.session.name = user.first_name;
      req.session.last_name = user.last_name;
      req.session.role = user.role;
      res.status(200).json({
        respuesta: "ok",
        cartId: user.cartId 
      });
    });
  } 
});

sessionRouter.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"], }),
  async (req, res) => {}
);

sessionRouter.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  async (req, res) => {
    req.session.user = req.user.username || req.user.email;
    req.session.name = req.user.first_name || req.user.email;
    req.session.last_name = req.user.last_name || '';
    req.session.user = true;
    const cartId = req.user.cartId;
    res.redirect(`/products?cartId=${cartId}`);
  }
);

sessionRouter.post("/loginJWT", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({ error: "Faltan datos" });
  }
  if (username === "coder@coder.com" && password === "1234") {
    const myToken = generateToken({ username });
    res
      .cookie("coderCookieToken", myToken, {
        maxAge: 60 * 60 * 1000,
        httpOnly: true,
      })
      .status(200)
      .json({ status: "success", token: myToken });
  } else {
    res.status(401).json({ error: "Usuario o contraseña incorrectos" });
  }
});

sessionRouter.get("/current", passportCall("jwt"), authorization("admin"), (req, res) => { 
    if (!req.isAuthenticated()) {
        res.status(401).json({ message: "No hay una sesión activa" });
    } else {
        const session = {
            message: "Sesión activa",
            user: req.user,
        };
        res.status(200).json(session);
    }
});

sessionRouter.get('/logout', (req, res) => {
  req.logout(function(err) {
      if (err) { return next(err); }
      req.session.destroy(function(err) {
          if (err) {
              console.log("Error al destruir la sesión:", err);
          }
          res.redirect('/login');
      });
  });
});

sessionRouter.get("/privado", (req, res) => { 
  if (req.session.user) { 
      res.render("products", {
          title: "Productos",
          user: req.session.user,
          name: req.session.name,
          lastName: req.session.last_name,
          welcomeMessage: `Bienvenido/a, ${req.session.user} ${req.session.last_name}!`
      });
  } else {
      res.redirect("/login");
  }
});

sessionRouter.get('/forgot', (req, res) => {
  res.render('forgot');
});

sessionRouter.post('/forgot', async (req, res) => {
  const { email } = req.body;
  const user = await UserModel.findOne({ email: email });
  if (!user) {
      return res.status(404).json({ message: 'No se encuentra el usuario con ese correo electrónico.' });
  }

  const resetToken = crypto.randomBytes(20).toString('hex');
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = Date.now() + 3600000;

  await user.save();

  const resetURL = `http://localhost:3000/reset/${resetToken}`;
  await sendPasswordResetEmail(user.email, resetURL);

  res.status(200).json({ message: 'Se ha enviado un correo electrónico con las instrucciones para restablecer la contraseña.' });
});


sessionRouter.post('/reset/:token', async (req, res) => {
  const { token } = req.params;
  const { newPassword, confirmNewPassword } = req.body;

  if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ error: 'Las contraseñas no coinciden.' });
  }

  try {
      const user = await UserModel.findOne({
          resetPasswordToken: token,
          resetPasswordExpires: { $gt: Date.now() }
      });

      if (!user) {
        return res.status(400).json({ error: 'Token de restablecimiento de contraseña inválido o expirado.', redirect: '/forgot' });
      }

      if (isValidPassword(user.password, newPassword)) {
        return res.status(400).json({ error: 'La nueva contraseña no puede ser igual a la contraseña actual.' });
    }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      user.password = hashedPassword;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();

      res.json({ message: 'La contraseña ha sido actualizada con éxito.' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al restablecer la contraseña.' });
  }
});

sessionRouter.put('/api/users/premium/:uid', authAdmin, async (req, res) => {
    try {
        const { uid } = req.params;
        const user = await UserModel.findById(uid);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        user.role = user.role === 'premium' ? 'user' : 'premium';
        await user.save();

        res.status(200).json({ message: `Rol actualizado a ${user.role}` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar el rol del usuario' });
    }
});


export default sessionRouter;