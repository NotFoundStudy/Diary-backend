import mongoose from 'mongoose';

const { Schema } = mongoose;

let userSchema = new Schema({
    email: {type: String, unique: true},
    studentId: {type: String},
	name: {type: String},
	password: { type: String },
    roles: [String],
    confirmation_code: String,
    confirmed: { type: Boolean, default: false },
	facebook: {
        id: String,
        token: String,
        email: String,
        name: String
    },
    google: {
        id: String,
        token: String,
        email: String,
        name: String
    }
	
}, {timestamps: true});

module.exports = mongoose.model('User',userSchema);