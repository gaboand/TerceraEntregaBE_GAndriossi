function authOrder(req, res, next) {
    console.log(req.session)
    const user = req.session.user;
    if (!user) {
        return res.sendStatus(401);
    }
    if (user) {
        console.log( "Orden creada para: " + user);
        req.user = user;
        return next();
    } else {
        return res.sendStatus(403);
    }
}

export default authOrder;