function authPremium(req, res, next) {
    const userRole = req.session.role;

    if (!userRole) {
        return res.sendStatus(401);
    }
    if (userRole === "Premium") {  
        return next();
    } else {
        return res.sendStatus(403);
    }
}

export default authPremium;