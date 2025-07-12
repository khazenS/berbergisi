// This function for installation for system
const { Admin } = require("../database/schemas/adminSchema")
const { Shop } = require("../database/schemas/shopSchema")

const createAdminDefault = async () => {
    try{
        const admin = await Admin.findOne({})

        if(!admin){
            await new Admin({
                username: 'admin',
                password: 'admin',
                adminAccessToken: null
            }).save()
            console.log("Default admin created successfully.")
        }
    }catch(err){
        console.error("Error creating default admin:", err)
    }
}

const createShopDefault = async () => {
    try{
        const shop = await Shop.findOne({})

        if(!shop){
            await new Shop({
                shopStatus:false,
                orderFeature:true,
                showMessage: null,
                services: [],
                serviceIDCounter: 1,
            }).save()
            console.log("Default shop created successfully.")
        }
    } catch(err){
        console.error("Error creating default shop:", err)
    }
}

module.exports = {
    createAdminDefault,
    createShopDefault
}