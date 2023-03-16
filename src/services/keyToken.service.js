"use strict"
const keyTokenModel = require("../models/keyToken.model")
class KeyTokenService{
    static createKeyToken = async ({userId, publicKey, privateKey, refreshToken}) => {
        try {
            // level 0
            // const tokens = await keyTokenModel.create({
            //     user: userId,
            //     publicKey,
            //     privateKey
            // })
            // return tokens ? tokens.publicKey : null;

            // level xxx
            const filter = { user: userId}, update = {
                publicKey, privateKey, refreshTokensUsed: [], refreshToken
            }, options = {upsert: true, new: true}
            console.log(userId,publicKey,privateKey,refreshToken, "::all");
            const tokens = await keyTokenModel.findOneAndUpdate(filter, update, options).exec()
            console.log("tokens::",tokens);
            return tokens ? tokens.publicKey : null
        } catch (error) {
            return error
        }
    }
}

module.exports = KeyTokenService