import { Router } from "express";

// Controller
import { userController, UserController } from "../controllers/user";

// Middleware
import authMiddleware from "../middlewares/auth";

class UserRoutes {
    router: Router;
    controller: UserController;

    constructor() {
        this.router = Router();
        this.controller = userController
        this.routes();
    }

    routes() {
        this.router.post('/register', this.controller.create);
        this.router.post('/login', this.controller.login);
        this.router.patch('/pin', authMiddleware.verifyToken, this.controller.createPin);
        this.router.get('/userInfo', authMiddleware.verifyToken, this.controller.getUserInfo);
    }
}

const userRoutes = new UserRoutes();

export default userRoutes.router;
