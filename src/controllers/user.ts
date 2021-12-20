import { Request, Response } from "express";

// Error handling
import { errorMessage, ErrorObject } from "./error"

// Interfaces
import { IAddress, IUser } from "../interfaces/User.interface";

// Models
import User from "../models/User";
import Account from "../models/Account";

//Utils
import Auth from "../utils/auth"
import Cbu from "../utils/cbu"

// Enums
import { Time } from "../enums/enums";

class UserController {
    public async create(req: Request, res: Response): Promise<void> {
        try {
            const address: IAddress = req.body.address;
            const userCount = await User.count();
            const accountNumber = Auth.getAccountNumber(JSON.stringify(Math.round(Math.random() * 100 * userCount + 1)));
            const cbu = new Cbu(accountNumber, req.body.branchCode).getCbu();
            const newAccount = await Account.create({ accountNumber, cbu, branchCode: req.body.branchCode, currency: "AR", balance: 0 });
            await newAccount.save();
            const userData: IUser = { ...req.body, address, birthDate: new Date(req.body.birthDate), accounts: [newAccount._id], admin: false };
            const authInfo = Auth.getAuthInfo(userData);
            const newUser = await User.create({ ...userData, address, password: authInfo.hash, accounts: [newAccount._id], balance: [] });
            await newUser.save();
            res.status(200).cookie("token", authInfo.token, {
                expires: new Date(Date.now() + Time.Hour),
                secure: false,
                httpOnly: true,
            }).json({ message: "success", data: { username: newUser.username } });
        } catch (e) {
            const message = errorMessage.getErrorMessage(e as ErrorObject);
            res.status(500).json({ message: "failure", data: message });
        }
    }


    public async getUserInfo(req: Request, res: Response): Promise<void> {
        try {
            const { username } = Auth.getUserInfo(req.cookies.token);
            const user = await User.find({
                username
            }).populate("accounts");

            res.status(200).json({
                message: "success", data: {
                    name: user[0].name,
                    email: user[0].email,
                    username: user[0].username,
                    birthDate: user[0].birthDate,
                    address: user[0].address,
                    accounts: user[0].accounts.map((account: { accountNumber: string; cbu: string; balance: string; }) => {
                        return {
                            cbu: account.cbu,
                            accountNumber: account.accountNumber,
                            balance: account.balance
                        }
                    }),
                    balance: user[0].balance.slice(0, 5),
                    pin: user[0].pin
                }
            });
        } catch (e) {
            const message = errorMessage.getErrorMessage(e as ErrorObject);
            res.status(500).json({ message: "failure", data: message });
        }
    }

    public async login(req: Request, res: Response): Promise<void> {
        try {
            const { username, password } = req.body;
            const user = await User.findOne({ username });

            if (!user) {
                res.status(404).json({ message: "failure", data: "User not found" });
                return;
            }

            const isLoggedIn = Auth.verifyPassword(password, user.password);

            if (!isLoggedIn) {
                res.status(401).json({ message: "failure", data: "Invalid credentials" });
                return;
            }

            const token = Auth.generateToken(user.name, user.email, user.username, user.accounts, user.admin);

            res.status(200).cookie("token", token, {
                expires: new Date(Date.now() + Time.Hour),
                secure: false,
                httpOnly: true,
            }).json({ message: "Login success", user: user.username });
        } catch (e) {
            const message = errorMessage.getErrorMessage(e as ErrorObject);
            res.status(401).json({ message: "Unauthorized", data: message });
        }
    }

    public async createPin(req: Request, res: Response): Promise<void> {
        try {
            const user = Auth.getUserInfo(req.cookies.token);
            const { pin } = req.body;

            if (!user) res.status(401).json({ message: "failure", data: "Invalid credentials" });

            const updated = pin.length === 8 ? await User.findOneAndUpdate({
                username: user.username
            },
                { pin },
                { new: true }
            ) : "Pin must be 8 digits";

            res.status(200).json({ message: "success", data: { user: updated.username, pin: updated.pin } });
        } catch (e) {
            const message = errorMessage.getErrorMessage(e as ErrorObject);
            res.status(500).json({ message: "failure", data: message });
        }
    }
}

const userController = new UserController();

export {
    userController,
    UserController
};