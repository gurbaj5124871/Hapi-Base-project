const mongoose = require('mongoose')

const appConfig = require('../configs/app-config')

const adminSettingSchema = new mongoose.Schema({
    otpExpiresInHours: { type: Number, default: 1 },
    linkExpiresInHours: { type: Number, default: 1 },

    isWebMultiSession: { type: Boolean, default: true },
    isDeviceMultiSession: { type: Boolean, default: false },

    isAdminSessionExpiry: { type: Boolean, default: true },
    adminTokenExpiresInHours: { type: Number, default: 1 },

    isUserSessionExpiry: { type: Boolean, default: true },
    userTokenExpirsInHours: { type: Number, default: null }
  })

  module.exports = mongoose.model('AdminSettings', adminSettingSchema)