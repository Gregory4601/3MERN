const { sign, verify } = require("jsonwebtoken");

const createTokens = (user) => {
    const accessToken = sign(
        { 
            _id: user._id, email: user.email, pseudo: user.pseudo, password: user.password, isAdmin: user.isAdmin
        },
        "JwtSecretNeedToChange"
    );
    return accessToken
};

const validateToken = (req, res, next) => {
    try {
        const accessToken = req.cookie["access_Token"];
    
        if (!accessToken) {
            // return false;
            res.status(400).json({ error: "User not Authenticated!" });
        }
        try {
            const validToken = verify(accessToken, "JwtSecretNeedToChange");
            if (validToken) {
                req.authenticated = true;
                // return true;
                return next();
            }
        } catch(err) {
            return res.status(400).json({ error: err })
        }
    } catch(err) {
        return res.status(400).json({ error_2: err })
    }
}

module.exports = { createTokens, validateToken };