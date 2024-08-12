import jwt from 'jsonwebtoken'

export const jwtKey = 'IbFEqOTDyS3zIVL'

export const generateToken = (user) => {
    const token = jwt.sign({user}, jwtKey, {expiresIn: '1m'})
    return token
}

export const authToken = (req, res, next) => {
    const token = req.cookies.token
    if(!token){
        res.status(401).json({status: 'rejected', details: 'Not authorized'})
        return
    }

    jwt.verify(token, jwtKey, (error, credentials) => {
        if(error){
            res.status(401).json({status: 'rejected', details: 'Not authorized'})
            return
        }
        req.user = credentials.user
        next()
    })
}

 