'use strict'

const shopModel = require("../models/shop.model")
const bcrypt = require("bcrypt")
// const crypto = require("crypto")
const crypto = require("node:crypto")
const KeyTokenService = require("../services/keyToken.service")
const { createTokenPair } = require("../auth/authUtils")
const { getInfoData } = require("../utils")
const { BadRequestError } = require("../core/error.response")

const RoleShop = {
    SHOP: 'SHOP',
    WRITE: 'WRITE',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}

class AccessService {
 static signUp = async ({name, email, password}) =>{
    // try {
        // step 1: check email exists?
        const holderShop = await shopModel.findOne({email}).lean().exec()
        if(holderShop){
            throw new BadRequestError("Error: Shop already registered!")
        }
        const passwordHash = await bcrypt.hash(password, 10)
        const newShop = await shopModel.create({
            name,email,passwordHash, roles: [RoleShop.SHOP]
        })

        if(newShop){
            // created privateKey, publicKey
            const privateKey = crypto.randomBytes(64).toString("hex")
            const publicKey = crypto.randomBytes(64).toString("hex")

            console.log({privateKey, publicKey}); //save collection KeyStore

            const keyStore = await KeyTokenService.createKeyToken({
                userId: newShop._id,
                publicKey, 
                privateKey
            })

            if(!keyStore){
                return {
                    code: "xxxx",
                    message: 'keyStore error'
                }
            }

            // created token pair
            const tokens = await createTokenPair({userId: newShop._id, email}, publicKey, privateKey) 
            console.log(`Created Token Success::`, tokens);
            return {
                code: 201,
                metadata: {
                    shop: getInfoData({fields: ["_id", "name", "email"], object: newShop}),
                    tokens
                }
            }
        }
        
        return {
            code: 201,
            metadata: null
        }

    // } catch (error) {
    //     return {
    //         code: 'xxx',
    //         message: error.message,
    //         status: 'error'
    //     }
    // }
 }
}

module.exports = AccessService