//Validar rol de user
export const validateClientRole = (req, res, next) => {
    try {
        if (req.user?.role !== 'CLIENT') {
            return res.status(403).send({ message: 'Access denied, only clients can create user' });
        }
        next();
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'General Error', err });
    }
}

export const validateAdminRole = (req, res, next) => {
    try {
        if (req.user?.role !== 'ADMIN') {
            return res.status(403).send({ message: 'Access denied, only admins' });
        }
        next();
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'General Error', err });
    }
}
