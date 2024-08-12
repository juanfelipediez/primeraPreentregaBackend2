import express from "express"
import cartsRoutes from "./routes/cart.routes.js"
import productsRoutes from "./routes/product.routes.js"
import handlebars from "express-handlebars"
import Handlebars from "handlebars"
import __dirname from "./dirname.js"
import viewsRouter from "./routes/views.router.js"
import mongoose from 'mongoose';
import { allowInsecurePrototypeAccess } from "@handlebars/allow-prototype-access";
  import cookieParser from "cookie-parser";
import MongoStore from "connect-mongo";
import session from "express-session";
import sessionRoutes from "./routes/session.routes.js";
import initializePassport from "./config/passport.config.js"
import passport from 'passport'


const app = express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))
const PORT = 5000

const userName = 'juanfelipediez'
const password = 'Felipe10'
const dbName = 'base'

app.use(cookieParser());
app.use(
  session({
    secret: "s3cr3t",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
      mongoUrl: "mongodb://localhost:27017/clase2",
      ttl: 15,
    }),
  })
);
initializePassport()
app.use(passport.initialize())
app.use(passport.session())

mongoose.connect(`mongodb+srv://${userName}:${password}@cluster0.wsvtnkd.mongodb.net/${dbName}?retryWrites=true&w=majority&appName=Cluster0`)
    .then(() => {
        console.log('DB connected!')
    })
    .catch((error) => {
        console.log(error)
    })



    

app.engine("handlebars", handlebars.engine({
    handlebars: allowInsecurePrototypeAccess(Handlebars),
}))
app.set("views", __dirname+"/views")
app.set("view engine", "handlebars")
app.use(express.static(__dirname+"/public"))

app.use("/api/carts", cartsRoutes)
app.use("/api/products", productsRoutes)
app.use("/api/sessions", sessionRoutes);

const httpServer = app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
})


app.use('/', viewsRouter)
