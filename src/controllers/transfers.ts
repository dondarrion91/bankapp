import { Request, Response } from "express";

// Error handling
import { errorMessage, ErrorObject } from "./error";

// utils
import Cbu from "../utils/cbu";
import Auth from "../utils/auth";

// Interface
import { IAccount } from "../interfaces/User.interface"

// Models
import Transfer from "../models/Transfer";
import Account from "../models/Account";
import User from "../models/User";

class TransferController {
    public async transferToAccount(req: Request, res: Response) {
        try {
            let completed = true;

            const destinationAccount: IAccount = await Account.findOne({
                cbu: req.body.cbu,
            });

            const originUserInfo = Auth.getUserInfo(req.cookies.token);

            const originAccount: IAccount = await Account.findById(originUserInfo.accounts[0]);

            const user = await User.findOne({
                username: originUserInfo.username,
            });

            const cbuObject = new Cbu(destinationAccount.accountNumber, destinationAccount.branchCode);

            if (!cbuObject.verifyCbu(req.body.cbu)) {
                res.status(400).json({ message: "failure", data: "Invalid Cbu" });
                return;
            }

            if (originAccount.balance < req.body.amount) {
                res.status(400).json({ message: "failure", data: "Insufficient funds" });
                return;
            }

            if (req.body.amount >= 10000) {
                completed = false;
            }

            const transfer = await Transfer.create({
                origin: originAccount.cbu,
                destination: destinationAccount.cbu,
                description: req.body.description,
                amount: req.body.amount,
                completed,
            });

            if (transfer.completed) {
                await Account.findOneAndUpdate({ cbu: originAccount.cbu }, { transfers: [...originAccount.transfers, transfer._id] as any });
                await Account.findOneAndUpdate({ cbu: originAccount.cbu }, { balance: originAccount.balance - parseInt(req.body.amount) as any });
                await Account.findOneAndUpdate({ cbu: destinationAccount.cbu }, { balance: destinationAccount.balance + req.body.amount });
                await User.findOneAndUpdate({ username: originUserInfo.username }, {
                    balance: [...user.balance,
                    {
                        transferId: transfer._id,
                        balance: originAccount.balance - parseInt(req.body.amount),
                        description: req.body.description,
                        destination: destinationAccount.cbu,
                        amount: req.body.amount,
                        date: new Date(),
                    }] as any
                });

                await transfer.save();
                res.status(200).json({ message: "success", data: "Transfer completed" });
                return;
            }

            res.status(200).json({
                message: "success",
                transferId: transfer._id,
                data: "Transfer created, but not completed please finish transfer with Security PIN"
            });
        } catch (e) {
            const message = errorMessage.getErrorMessage(e as ErrorObject);
            res.status(500).json({ message: "failure", data: message });
        }
    }

    public async completeTransferWithPIN(req: Request, res: Response) {
        try {
            const { transferId, pin } = req.body;
            const originUserInfo = Auth.getUserInfo(req.cookies.token);
            const user = await User.findOne({
                username: originUserInfo.username,
            });

            if (user.pin !== pin) {
                res.status(400).json({ message: "failure", data: "Invalid PIN" });
                return;
            }

            const transfer = await Transfer.findById(transferId);
            const originAccount: IAccount = await Account.findOne({
                cbu: transfer.origin,
            });

            const destinationAccount: IAccount = await Account.findOne({
                cbu: transfer.destination,
            });

            await Account.findOneAndUpdate({ cbu: originAccount.cbu }, { transfers: [...originAccount.transfers, transfer._id] as any });
            await Account.findOneAndUpdate({ cbu: originAccount.cbu }, { balance: originAccount.balance - parseInt(transfer.amount) as any });
            await Account.findOneAndUpdate({ cbu: destinationAccount.cbu }, { balance: destinationAccount.balance + transfer.amount });
            await User.findOneAndUpdate({ username: originUserInfo.username }, {
                balance: [...user.balance,
                {
                    transferId: transfer._id,
                    balance: originAccount.balance - parseInt(req.body.amount),
                    description: req.body.description,
                    destination: destinationAccount.cbu,
                    amount: req.body.amount,
                    date: new Date(),
                }] as any
            });
            await transfer.updateOne({ completed: true });

            res.status(200).json({ message: "success", data: "Transfer completed" });
        } catch (e) {
            const message = errorMessage.getErrorMessage(e as ErrorObject);
            res.status(500).json({ message: "failure", data: message });
        }
    }

    public async testDeposit(req: Request, res: Response) {
        try {
            const account = await Account.findOne({
                cbu: req.body.cbu,
            });

            if (!account) {
                res.status(400).json({ message: "failure", data: "Account with " + req.body.cbu + " not found" });
                return;
            }

            const deposit = await Account.updateOne({ cbu: req.body.cbu }, { balance: account.balance + req.body.amount });

            res.status(200).json({ message: "success", deposit });
        } catch (e) {
            const message = errorMessage.getErrorMessage(e as ErrorObject);
            res.status(500).json({ message: "failure", data: message });
        }
    }
}

const transferController = new TransferController();

export {
    transferController,
    TransferController
};