const mongoose = require('mongoose');

const appConfig = require('../configs/app-config')

const customerSchema = new mongoose.Schema({
  customCustomerID: { type: String },
  totalRatingPoints: { type: Number, default: 0 },
  ratedByUserCount: { type: Number, default: 0 },

  isBlocked: { type: Boolean, default: false, index: true }
}, { timestamps: true })

const serviceProviderSchema = new mongoose.Schema({
  customServiceProviderID: { type: String },
  totalRatingPoints: { type: Number, default: 0 },
  ratedByUserCount: { type: Number, default: 0 },

  isBlocked: { type: Boolean, default: false, index: true }
})

const driverSchema = new mongoose.Schema({
  customDriverID: { type: String },
  totalRatingPoints: { type: Number, default: 0 },
  ratedByUserCount: { type: Number, default: 0 },

  currentLocation: {
    type: { type: String, default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] }
  },
  isActive: { type: Boolean, default: true, index: true },

  isBlocked: { type: Boolean, default: false, index: true }
}, { timestamps: true })

driverSchema.index({ currentLocation: '2dsphere' })

const userSchema = new mongoose.Schema({
  firstName: { type: String, trim: true, index: true, default: null, sparse: true },
  lastName: { type: String, trim: true, default: null },
  email: { type: String, trim: true, index: true, sparse: true },
  countryCode: { type: String, default: null },
  countryISOCode: { type: String, default: null },
  mobile: { type: String, index: true, trim: true, sparse: true, default: null },
  contacts: [{
    mobile: { type: String },
    isVerified: { type: Boolean, default: false, index: true },
    isPrimary: { type: Boolean, default: false },
    mobileOTP: { type: Number },
    countryCode: { type: String },
    otpUpdatedAt: { type: Date },
    countyrISOCode: { type: String, default: null },
  }],

  password: { type: String, required: false },

  emailVerificationToken: { type: String, required: false },
  emailVerificationTokenUpdatedAt: { type: Date },
  utcoffset: { type: Number },
  passwordResetToken: { type: String, default: null },

  image: { type: String, default: null },
  thumbnami: { type: String, default: null },

  role: [{ type: String }],
  currentRole: { type: String, default: null, index: true },
  lang: { type: String, default: appConfig.get('/lang', { lang: 'en' }) },

  customer: { type: customerSchema, default: null },
  serviceProvider: { type: serviceProviderSchema, default: null },
  driver: { type: driverSchema, default: null },

  facebookId: { type: String, default: null },

  isBlocked: { type: Boolean, default: false, index: true },
  isDeleted: { type: Boolean, default: false, index: true },

  isAdminVerified: { type: Boolean, default: false, index: true },
  isEmailVerified: { type: Boolean, default: false, index: true },
  isPhoneVerified: { type: Boolean, default: false, index: true }
}, { timestamps: true })

userSchema.pre('save', function (next) {
  const user = this
  if (!user.isModified('password')) return next()

  // Function to hash the password

  return next()
})

userSchema.pre('findOneAndUpdate', function () {
  // Function to hash the password
  const password = this.getUpdate().$set.password

  if (!password)
    return

  this.findOneAndUpdate({}, { password })
})

module.exports = mongoose.model('User', userSchema)