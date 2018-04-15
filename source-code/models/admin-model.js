const mongoose = require('mongoose');

const appConfig = require('../configs/app-config')

const adminSchema = new mongoose.Schema({ 
    firstName: { type: String, trim: true, default: null },
    lastName: { type: String, trim: true, default: null },
    email: { type: String, trim: true, index: true, sparse: true },
    countryCode: { type: String, default: null },
    countyrISOCode: { type: String, default: null },
    mobile: { type: String, index: true, trim: true, sparse: true, default: null },
    
    password: { type: String, required: true },

    utcoffset: { type: Number },
    passwordResetToken: { type: String, default: null },
    
    image: { type: String, default: null },
    thumbnail: { type: String, default: null },
    
    isSuperAdmin: { type: Boolean, default: false },
    role: [{ type: String }],
    currentRole: { type: String, default: null, index: true },
    lang: { type: String, default: appConfig.get('/lang', { lang: 'en' }) },
    
    isBlocked: { type: Boolean, default: false, index: true },
    isDeleted: { type: Boolean, default: false, index: true },
    isAdminVerified: { type: Boolean, default: false, index: true }
    
  }, { timestamps: true })

  adminSchema.pre('save', function (next) {
    const user = this
    if (!user.isModified('password')) return next()
  
    // Function to hash the password
  
    return next()
  })
  
  adminSchema.pre('findOneAndUpdate', function () {
    // Function to hash the password
    const password = this.getUpdate().$set.password
  
    if (!password)
      return
  
    this.findOneAndUpdate({}, { password })
  })

  module.exports = mongoose.model('Admin', adminSchema)