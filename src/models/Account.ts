import { Schema, model } from 'mongoose';

const AccountSchema = new Schema({
    accountNumber: { type: String, required: true, unique: true },
    cbu: { type: String, required: true, unique: true },
    branchCode: { type: String, required: true, unique: false, minlength: 4, maxlength: 4 }, // branch code
    currency: { type: String, required: true, unique: false, minlength: 2, maxlength: 2 },
    balance: { type: Number, required: true, unique: false },
    transfers: [{ type: Schema.Types.ObjectId, ref: 'Transfer', strictPopulate: false }],
    createdAt: { type: Date, default: Date.now },
});


export default model('Account', AccountSchema);