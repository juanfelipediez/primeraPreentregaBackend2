import passport from 'passport'
import localStrategy from 'passport-local'
import {createHash, isValidPassword } from '../utils/hashFunctions.js';
import {authToken, generateToken, jwtKey} from '../utils/jwtFunctions.js'
import jwt from 'passport-jwt'
import { userModel } from '../models/user.model.js';
import { cartModel } from '../models/carts.model.js';
import cookieParser from "cookie-parser";

const LocalStrategy = localStrategy.Strategy;

const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

function initializePassport(){
    passport.use('register', new LocalStrategy(
        {
            usernameField: 'email',
            passReqToCallback: true, 
        },
        async (req, email, password, done) => {
            try{
                const {first_name, last_name, age,} = req.body
                if( !first_name || !last_name || !age ){
                    done(null, false, {message: 'All fields are required.'})
                }
                const user = await userModel.findOne({ email });
                if(user){
                    return done(null, false, {message: 'This email is alredy registered'});
                }
                const newCart = await cartModel.create({})
                const newUser = await userModel.create({
                    first_name,
                    last_name,
                    email,
                    age,
                    password: createHash(password),
                    cart: newCart._id
                })
                return done(null, newUser)
            }catch(error){
                return done({error})
            }
        }
    ))

    passport.use('login', new LocalStrategy(
        {
            usernameField: 'email',
        },
        async (username, password, done) => {
            try{
                if(!username || !password){
                    return done(null, false, {message: 'All fields are required.'})
                }
                console.log(username)

                const user = await userModel.findOne({email: username})
                if(!user){
                    return done(null, false, {message: 'This email is not registered'})
                }
                if(!isValidPassword(user, password)){
                    return done(null, false, {message: 'Password is not correct.'})
                }

                return done(null, user)
            } catch(error){
                return done({status: 'error', message: error.message})
            }
    
        }
    ))

    passport.use(
        "current",
        new JWTStrategy(
          {
            jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
            secretOrKey: jwtKey,
          },
          async (payload, done) => {
            try {
              done(null, payload);
            } catch (error) {
              return done(error);
            }
          }
        )
    )

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });
    
    passport.deserializeUser(async (id, done) => {
        try {
          const user = await userModel.findById(id);
        
          return done(null, user);
        } catch (error) {
          return done(`Hubo un error: ${error.message}`);
        }
    });
}


function cookieExtractor(req) {
    let token = null;
  
    if (req && req.cookies) {
      token = req.cookies.token;
    }
  
    return token;
  }

export default initializePassport