const lodash = require('lodash')
const bluebird = require('bluebird')
const bcrypt = bluebird.promisifyAll(require('bcrypt'))

const appConfig = require('../configs/app-config')
const mongoServices = require('../services/mongo-services')
const models = require('../models')
const services = require('../services');

// Bootstraping Default super admins
(async () => {
    const superAdminEmails = [
        'admin1@yopmail.com',
        'admin2@yopmail.com',
        'admin3@yopmail.com'
    ]

    const criteria = {
        email: { $in: superAdminEmails },
        isDeleted: false
    }

    const superAdmins = await mongoServices.find(models.admin, criteria, { email: 1 }, { lean: true, limit: 3 })
    if(superAdmins.length < 3) {
        const data = []
        const password = await bcrypt.hash('Password@1', 10)
        superAdminEmails.forEach(mail => {
            if(!lodash.find(superAdmins, { email: mail }))
            data.push(
                {
                    email: mail,
                    roles: [appConfig.get('/roles/superAdmin')],
                    password,
                    isAdminVerified: true
                }
            )
        })
        mongoServices.insertMany(models.admin, data)
    }
})();



