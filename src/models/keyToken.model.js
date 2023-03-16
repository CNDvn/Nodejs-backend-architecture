"use strict"

const {Schema, model} = require("mongoose");

const DOCUMENT_NAME = 'Key'
const COLLECTION_NAME = 'Keys'

const keyTokenSchema = new Schema({
    user:{
        type: Schema.Types.ObjectId,
        require: true,
        ref: "Shop"
    },
    privateKey:{
        type:String,
        require:true,
    },
    publicKey:{
        type:String,
        require:true,
    },
    refreshTokensUsed:{
        type: Array,
        default: [] // Những refresh token đã được sử dụng
    },
    refreshToken: {
        type: String,
        require: true
    }
},{
    collection: COLLECTION_NAME,
    timestamps: true,
})

module.exports = model(DOCUMENT_NAME, keyTokenSchema)