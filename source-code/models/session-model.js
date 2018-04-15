const mongoose = require('mongoose');

const appConfig = require('../configs/app-config')

const sessionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.ObjectId, ref: 'User', index: true },
    admin: { type: mongoose.Schema.ObjectId, ref: 'Admin', index: true },
    
    remoteIP: { type: String },
    deviceType: {
        type: String,
        enum: [
            appConfig.get('/deviceType/android'),
            appConfig.get('/deviceType/ios'),
            appConfig.get('/deviceType/web'),
        ]
    },
    deviceToken: { type: String },

    isSelfExpiry: { type: Boolean, default: appConfig.get('/isSessionSelfExpiry') },
    exipireAt: { type: Date, default: null }
}, { timestamps: true })

module.exports = mongoose.model('Session', sessionSchema)