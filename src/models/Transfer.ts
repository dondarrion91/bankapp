import { Schema, model } from 'mongoose';

const TransferSchema = new Schema({
    origin: { type: String, required: true, unique:false },
    destination: { type: String, required: true, unique: false },
    description: { type: String, required: true, unique: false },
    amount: { type: Number, required: true, unique: false },
    completed: { type: Boolean, required: true, unique: false },
    createdAt: { type: Date, default: Date.now },
});


export default model('Transfer', TransferSchema);