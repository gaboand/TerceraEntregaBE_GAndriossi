function authOrder(req, res, next) {
    const user = req.session.user;
    if (!user) {
        return res.sendStatus(401);
    }
    if (user) {
        req.user = user;
        return next();
    } else {
        return res.sendStatus(403);
    }
}

export default authOrder;