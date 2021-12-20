import {JwtPayload} from 'jsonwebtoken';

interface IUser {
    _id: string;
    name: string;
    email: string;
    birthDate: Date;
    username: string;
    address: IAddress;
    password: string;
    accountNumber: string;
    branchCode: string;
    accounts: IAccount;
    balance: Object[];
    cbu: string;
    pin: string;
    admin: boolean;
}

interface IAccount {
    accountNumber: string;
    branchCode: string;
    cbu: string;
    currency: string;
    transfers: ITransfer[];
    balance: number;
}

interface IAddress {
    street: string;
    number: number;
    city: string;
}

interface IAuth extends JwtPayload {
    username: string;
}

interface ITransfer {
    origin: string;
    destination: string;
    description: string;
    amount: string;
}

export {
    IUser,
    IAddress,
    IAuth,
    IAccount,
    ITransfer
}