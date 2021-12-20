import { Router } from "express";

// Controller
import { crudController, CrudController } from "../controllers/crud";

// Model
import Account from "../models/Account";

// Middleware
import authMiddleware from "../middlewares/auth";
import AdminMiddleWare from "../middlewares/admin";

class AccountRoutes {
    router: Router;
    controller: CrudController;

    constructor() {
        this.router = Router();
        this.controller = crudController
        this.routes();
    }

    async routes() {
        this.router.get('/', authMiddleware.verifyToken, AdminMiddleWare.isAdmin, await this.controller.getAll(Account));
        this.router.get('/:id', authMiddleware.verifyToken, AdminMiddleWare.isAdmin, await this.controller.getById(Account));
    }
}

const accountRoutes = new AccountRoutes();

export default accountRoutes.router;
