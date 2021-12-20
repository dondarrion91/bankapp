import { Request, Response } from "express";

// Error handling
import { errorMessage, ErrorObject } from "./error"

class CrudController {
    public async getAll(model: any) {
        return async (req: Request, res: Response) => {
            try {
                const data = await model.find({
                    createdAt: {
                        $gte: req.query.from,
                        $lt: req.query.to
                    }
                }, null, {
                    skip: parseInt(req.query.skip as string),
                    limit: parseInt(req.query.limit as string),
                });
                res.status(200).json({ message: "success", data });
            } catch (e) {
                const message = errorMessage.getErrorMessage(e as ErrorObject);
                res.status(500).json({ message: "failure", data: message });
            }
        }
    }

    public async getById(model: any) {
        return async (req: Request, res: Response) => {
            try {
                const data = await model.findById(req.params.id);
                res.status(200).json({ message: "success", data });
            } catch (e) {
                const message = errorMessage.getErrorMessage(e as ErrorObject);
                res.status(500).json({ message: "failure", data: message });
            }
        }
    }
}

const crudController = new CrudController();

export {
    crudController,
    CrudController
};