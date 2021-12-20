import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    birthDate: { type: Date, required: true },
    username: { type: String, required: true, unique: true },
    address: { type: Object, required: true },
    password: { type: String, required: true },
    pin: {type: String, required: false, unique: false, minlength: 8, maxlength: 8}, // Security pin
    accounts: [{ type: Schema.Types.ObjectId, ref: 'Account', strictPopulate: false }],
    balance: { type: Array, required: true, unique: false },
    admin: { type: Boolean, required: true, unique: false },
    createdAt: { type: Date, default: Date.now },
});


export default model('User', UserSchema);