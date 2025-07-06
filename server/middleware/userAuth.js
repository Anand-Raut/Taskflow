import jwt from 'jsonwebtoken'

const userAuth = async (req, res, next) => {
    const {token} = req.cookies;

    if (!token){
        return res.json({
            success: false,
            message: 'Unauthorized, Login again'
        })
    }
    try {

        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET)
        
        if (tokenDecode.id){
            req.userId = tokenDecode.id
        }else{
            res.json({
                success: false,
                message: 'Not authorized, login again'
            })
        }
        next();

    } catch (error) { 
        return res.json({
            success: false,
            message: `chxd gye guru, ${error.message}`
        })
    }
}

export default userAuth