import jwt from 'jsonwebtoken';
const generatetoken = async (userId,res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '30d' });
    

    res.cookie('token', token, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true, //prevent XSS attack (cross site scripting)
        sameSite: "strict", // CSRF attack cross site request forgery attack
        secure: process.env.NODE_ENV !== 'development' //cookie only works in https
    });


    return token
}

export default generatetoken;