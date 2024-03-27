function authAdmin(req, res, next) {
    const userRole = req.session.role;
    if (!user) {
        return res.sendStatus(401);
    }
    if (userRole === "admin") {
        return next();
    } else {
        return res.sendStatus(403);
    }
}

export default authAdmin;