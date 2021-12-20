import { Request, Response, NextFunction } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import { config } from '../../config/config';
// Error handling
import { errorMessage, ErrorObject } from "../controllers/error"

class AdminMiddleWare {
    public static isAdmin(req: Request, res: Response, next: NextFunction) {
        try {
            const token = req.cookies.token;

            const decoded: any = jwt.verify(token, config.SECRET as Secret);

            if (!decoded.admin) {
                res.status(401).json({ message: "Unauthorized", data: "Not Admin" });
                return;
            }

            next();

        } catch (e) {
            const message = errorMessage.getErrorMessage(e as ErrorObject);
            res.status(500).json({ message: "failure", data: message });
        }
    }
}

export default AdminMiddleWare;