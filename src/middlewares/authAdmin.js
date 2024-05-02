function authAdmin(req, res, next) {
    const userRole = req.session.role;

    if (!userRole) {
        return res.sendStatus(401);
    }
    if (userRole === "admin") {
        return next();
    } next();
}

export default authAdmin;