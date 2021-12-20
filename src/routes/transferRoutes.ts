import { Router } from "express";

// Controller
import { transferController, TransferController } from "../controllers/transfers";
import { crudController, CrudController } from "../controllers/crud";

//Models
import Transfer from "../models/Transfer";

// Middleware
import authMiddleware from "../middlewares/auth";

class TransferRoutes {
    router: Router;
    controller: TransferController;
    crud: CrudController;

    constructor() {
        this.router = Router();
        this.controller = transferController
        this.crud = crudController
        this.routes();
    }

    async routes() {
        this.router.get('/', authMiddleware.verifyToken, await this.crud.getAll(Transfer));
        this.router.post('/', authMiddleware.verifyToken, await this.controller.transferToAccount);
        this.router.post('/complete', authMiddleware.verifyToken, await this.controller.completeTransferWithPIN);
        this.router.post('/deposit', authMiddleware.verifyToken, await this.controller.testDeposit);
    }
}

const transferRoutes = new TransferRoutes();

export default transferRoutes.router;
