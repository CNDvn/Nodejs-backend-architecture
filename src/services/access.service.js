'use strict'

const shopModel = require("../models/shop.model")
const bcrypt = require("bcrypt")
// const crypto = require("crypto")
const crypto = require("node:crypto")
const KeyTokenService = require("../services/keyToken.service")
const { createTokenPair } = require("../auth/authUtils")
const { getInfoData } = require("../utils")
const { BadRequestError, AuthFailureError } = require("../core/error.response")
const { findByEmail } = require("./shop.service")

const RoleShop = {
    SHOP: 'SHOP',
    WRITE: 'WRITE',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}

class AccessService {

    static login = async ({email, password, refreshToken = null}) => {
        const foundShop = await findByEmail({email})
        if(!foundShop) throw new BadRequestError("Shop not registered")

        const match = await bcrypt.compare(password, foundShop.password)
        if(!match) throw new AuthFailureError('Authentication error')

        const privateKey = crypto.randomBytes(64).toString('hex')
        const publicKey = crypto.randomBytes(64).toString('hex')

        const {_id: userId} = foundShop
        const tokens = await createTokenPair({userId, email}, publicKey, privateKey)

        await KeyTokenService.createKeyToken({
            userId,
            refreshToken: tokens.refreshToken,
            privateKey,
            publicKey,
        })
        
        return {
            metadata: {
                shop: getInfoData({fields: ['_id', 'name', 'email'], object: foundShop}),
                tokens
            }
        }
    }

 static signUp = async ({name, email, password}) =>{
    // try {
        // step 1: check email exists?
        const holderShop = await shopModel.findOne({email}).lean().exec()
        if(holderShop){
            throw new BadRequestError("Error: Shop already registered!")
        }
        const passwordHash = await bcrypt.hash(password, 10)
        const newShop = await shopModel.create({
            name, email, password: passwordHash, roles: [RoleShop.SHOP]
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