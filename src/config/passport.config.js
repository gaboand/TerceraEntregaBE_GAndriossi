import passport from "passport";
import local from "passport-local";
import { UserModel } from "../dao/mongo/models/user.model.js";
import { CartModel } from "../dao/mongo/models/carts.model.js";
import { createHash, isValidPassword } from "../utils.js";

const LocalStrategy = local.Strategy;

const initializePassport = () => {
  passport.use("register",
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;
        try {
          console.log("Registro: Buscando usuario existente con email:", email);
          const user = await UserModel.findOne({ email: username });
          if (user) {
            console.log("Registro: Usuario ya existe con email:", email);
            return done(null, false, { message: "El usuario ya existe" });
          }

          const newCart = await CartModel.create({});
          console.log("Registro: Creando nuevo carrito para usuario");

          const newUser = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
            cartId: newCart._id,
          };

          const result = await UserModel.create(newUser);
          console.log("Registro: Usuario creado con éxito con email:", email);
          return done(null, result);
        } catch (error) {
          console.log("Registro: Error al crear usuario:", error);
          return done("Error al crear el usuario", error);
        }
      }
    )
  );

  passport.use("login",
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
        passwordField: "password",
      },
      async (req, username, password, done) => {
        try {
          console.log("Login: Intentando iniciar sesión para:", username);
          const user = await UserModel.findOne({ email: username });
          if (!user) {
            console.log("Login: Usuario no encontrado con email:", username);
            return done(null, false, { message: "Usuario no encontrado" });
          }

          if (!isValidPassword(user.password, password)) {
            console.log("Login: Contraseña incorrecta para email:", username);
            return done(null, false, { message: "Contraseña incorrecta" });
          } else {
            console.log("Login: Usuario autenticado con éxito con email:", username);
            return done(null, user);
          }
        } catch (error) {
          console.log("Login: Error durante la autenticación para:", username, error);
          return done("Error al obtener el usuario", error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    console.log("Serializando usuario:", user._id);
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    console.log("Deserializando usuario con ID:", id);
    let user = await UserModel.findById(id);
    console.log("Usuario deserializado:", user ? user.email : "Usuario no encontrado");
    done(null, user);
  });
};

export default initializePassport;
