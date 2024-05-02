import express from "express";
import { Server } from "socket.io"; 
import {engine} from "express-handlebars";
import IndexRouter from "./routes/index.routes.js";
import mongoose from "mongoose";
import { __dirname} from "./utils.js";
import MongoStore from "connect-mongo";
import session from "express-session";
import cookieParser from "cookie-parser";
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import initializePassportGH from "./config/passportGithub.config.js";
import initializePassportJWT from "./config/passportJWT.config.js";
import cors from "cors";
import dotenv from "dotenv";
import { addLogger } from "./middlewares/logger.js";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";


const app = express();
const PORT = process.env.PORT || 8080;
const DB_URL = process.env.DB_URL;
const COOKIESECRET = process.env.CODERSECRET;
dotenv.config();

const swaggerOptions = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "Ecommerce API",
      version: "1.0.0",
      description: "API para Ecommerce",
      contact: {
        name: "G Andriossi",
      },
      servers: ["http://localhost:3000"],
    }},

  apis: [`${__dirname}/docs/**/*.yaml`]
};

const specs = swaggerJSDoc(swaggerOptions);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(COOKIESECRET));
app.use(express.static(__dirname + "/public"));

app.engine("handlebars", engine());
app.set("views", __dirname + "/views"); 
app.set("view engine", "handlebars");

app.use(
  session({
    store: MongoStore.create({
      mongoUrl: DB_URL,
      mongoOptions: {
      
      },
      ttl: 3600,
    }),
    secret: "CoderSecret",
    resave: false,
    saveUninitialized: true,
  })
);

initializePassport();
initializePassportGH();
initializePassportJWT();

app.use(passport.initialize());
app.use(passport.session());

app.use(addLogger);
app.get('/loggerTest', (req, res) => {
    req.logger.debug('Depurar');
    req.logger.http('Mensaje HTTP');
    req.logger.info('Mensaje informativo');
    req.logger.warn('Mensaje de advertencia');
    req.logger.error('Error detectado');
    req.logger.log('fatal', 'Alerta maxima');
    res.send('Testing logger realizado');
});

app.use("/docs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

app.use("/", IndexRouter);

const server = app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});

const io = new Server(server);

app.use((req, res, next) => {
	req.io = io;
	next();
});

app.use(cors({ 
  origin: ["http://localhost:3000", "http://127.0.0.1:5500"],
  credentials: true
}));

io.on("connection", (socket) => {
	console.log("Se conecto un nuevo usuario");
});

startMongoConnection()
  .then(() => {
    console.log("Base de datos conectada");
  })
  .catch((error) => {
    console.error("Error al conectar a la base de datos:", error);
  })

  async function startMongoConnection() {
    await mongoose.connect(DB_URL);
  }

export default app;