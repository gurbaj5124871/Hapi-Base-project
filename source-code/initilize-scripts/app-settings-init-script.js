const mongoServices = require('../services/mongo-services')
const models = require('../models');

(async () => {
    const count = await mongoServices.count(models.appSettings, {})
    if (count < 1) {
        await mongoServices.createOne(models.appSettings, {
            otpExpiresInHours: 1,
            linkExpiresInHours: 1,

            isWebMultiSession: true,
            isDeviceMultiSession: false,

            isAdminSessionExpiry: true,
            adminTokenExpiresInHours: 1,

            isUserSessionExpiry: false,
            userTokenExpirsInHours: null
        })
    }
})();