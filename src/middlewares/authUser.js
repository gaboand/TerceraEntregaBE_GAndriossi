function authUser(req, res, next) {
    const userRole = req.session.role;

    if (!userRole) {
        return res.sendStatus(401);
    }
    if (userRole === "user") {
        return next();
    } else {
        return res.sendStatus(403);
    }
}

export default authUser;