const authorizationMiddleware = (allowedRoles) => {
    return (req, res, next) => {
        const userRole = req.user?.user; 

        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({ error: "Access denied. You do not have the required permissions." });
        }

        next(); 
    };
};

module.exports = authorizationMiddleware;