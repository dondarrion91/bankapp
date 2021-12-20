import bcrypt from 'bcryptjs';
import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
import { config } from "../../config/config";
import { Time, EAuth } from "../enums/enums"
import { IAccount, IAuth, IUser } from "../interfaces/User.interface";

class Auth {
    hash: string

    constructor(password: string) {
        this.hash = this.hashPassword(password);
    }

    private hashPassword(password: string) {
        const salt = bcrypt.genSaltSync(EAuth.Salt);
        return bcrypt.hashSync(password, salt);
    }

    static generateToken(name: string, email: string, username: string, accounts: IAccount, admin: boolean): string {
        return jwt.sign({
            name, email, username, accounts, admin
        }, config.SECRET as Secret, { expiresIn: Time.Hour });
    }

    static verifyPassword(password: string, hash: string) {
        return bcrypt.compareSync(password, hash);
    }

    static getAccountNumber(userNumber: string): string {
        const accountNumber = userNumber.split("");

        while (accountNumber.length < EAuth.AccountNumberLength) {
            accountNumber.unshift("0");
        }

        return accountNumber.join("");
    }

    static getUserInfo(token: string): IAuth {
        return jwt.verify(token, config.SECRET as Secret) as IAuth;
    }

    static getAuthInfo(info: IUser) {
        const { name, email, username, accounts, password, admin } = info;
        const auth = new Auth(password);

        return {
            hash: auth.hash,
            token: Auth.generateToken(name, email, username, accounts, admin)
        }
    }

    static userResponse(user: IUser) {
        return {
            id: user._id,
            name: user.name,
            email: user.email,
            username: user.username,
            birthDate: user.birthDate,
            address: user.address,
            accounts: user.accounts,
            balance: user.balance.slice(0, 5),
            cbu: user.cbu,
            pin: user.pin
        }
    }
}

export default Auth;