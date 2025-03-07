import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    toWatch: [{
        type: String, // Anime ID
        default: []
    }],
    watching: [{
        type: String, // Anime ID
        default: []
    }],
    watched: [{
        type: String, // Anime ID
        default: []
    }]
}, {
    timestamps: true
});

export default mongoose.model('User', userSchema);