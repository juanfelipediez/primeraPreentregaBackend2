import { Router } from "express"
import { isValidPassword, createHash } from "../utils/hashFunctions.js"
import passport from 'passport'
import { userModel } from '../models/user.model.js';
import { cartModel } from '../models/carts.model.js';
import {authToken, generateToken, jwtKey} from '../utils/jwtFunctions.js'

const router = Router()


router.post('/register', passport.authenticate('register',{failureRedirect:'/failregister'}), async (req, res) => {
    return res.status(200).json({status: 'success', message: 'New user created!'})
})

router.post('/login', passport.authenticate('login',{failureRedirect:'/login-error'}), async (req, res) => {

    const payload = {
        email: req.user.email,
        role: req.user.role
    }
    const token = generateToken(payload)
    res.cookie('token', token, {
        maxAge: 1000*60,
        httpOnly: true
    })
    res.status(200).json({status: 'success', details: 'success login'})
})

router.get("/login-error",  async (req, res) => {
    res.status(401).json({mensaje: 'Hubo un error'});
  });

router.get("/logout", async (req, res) => {
    req.clearCookie("token");

    res.json({ message: "Sesión cerrada" });
  });

router.get('/current', passport.authenticate('current',{session: false}), async (req, res) => {
    res.status(200).json({status: 'success', details: 'Active session', user: req.user})
})
export default router 
