const mongoose = require('mongoose')
const bluebird = require('bluebird')
const bcrypt = bluebird.promisifyAll(require('bcrypt'))

const appConfig = require('../configs/app-config')

const customerSchema = new mongoose.Schema({
  customerID: { type: String },
  totalRatingPoints: { type: Number, default: 0 },
  ratedByUserCount: { type: Number, default: 0 },

  isBlocked: { type: Boolean, default: false, index: true }
}, { timestamps: true })

const serviceProviderSchema = new mongoose.Schema({
  serviceProviderID: { type: String },
  totalRatingPoints: { type: Number, default: 0 },
  ratedByUserCount: { type: Number, default: 0 },

  isBlocked: { type: Boolean, default: false, index: true }
})

const driverSchema = new mongoose.Schema({
  driverID: { type: String },
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
  firstName: { type: String, trim: true, required: true, index: true, sparse: true },
  lastName: { type: String, trim: true, default: null },
  email: { type: String, trim: true, required: true, index: true, sparse: true },
  countryCode: { type: String, default: null },
  countryISOCode: { type: String, default: null },
  mobile: { type: String, index: true, trim: true, sparse: true, default: null },

  password: { type: String, default: null },
  passwordResetToken: { type: String, default: null },

  utcoffset: { type: Number },

  image: { type: String, default: null },
  thumbnami: { type: String, default: null },

  roles: [{ type: String }],
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
  isPhoneVerified: { type: Boolean, default: false, index: true },

  mobileOTP: { type: Number },
  otpUpdatedAt: { type: Date },
  changeMobile: { type: {
    mobile: { type: String },
    mobileOTP: { type: Number },
    countryCode: { type: String },
    otpUpdatedAt: { type: Date },
    countryISOCode: { type: String, default: null },
  }, default: null },

  emailVerificationToken: { type: String, default: null },
  emailVerificationTokenUpdatedAt: { type: Date },
}, { timestamps: true })

userSchema.pre('save', async function (next) {
  const user = this
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 10)
  }

  return next()
})

// userSchema.pre('findOneAndUpdate', async () => {

//   const password = generateHashPassword(this.getUpdate().$set.password)

//   if (!password)
//     return

//   this.findOneAndUpdate({}, { password })
// })

async function generateHashPassword (pass) {
  return await bcrypt.hash(pass, 10)
}

module.exports = mongoose.model('User', userSchema)