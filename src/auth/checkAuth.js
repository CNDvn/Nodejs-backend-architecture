'use strict'

const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization'
}

const {findById} = require("../services/apiKey.service")

const apiKey = async (req,res,next) => {
    try {
        const key = req.headers[HEADER.API_KEY]?.toString()
        if(!key){
            res.status(403).json({
                message: "Forbidden Error"
            })
        }
        // check objKey
        const objKey = await findById(key)
        if(!objKey){
            res.status(403).json({
                message: "Forbidden Error"
            })
        }
        req.objKey = objKey
        return next();
    } catch (error) {
        console.log(error);
    }
}

const permission = (permission) => {
    return (req, res, next) => {
        if(!req.objKey.permissions){
            res.status(403).json({
                message: "Permission denied"
            })
        }
        const validPermission = req.objKey.permissions.includes(permission)
        if(!validPermission){
            res.status(403).json({
                message: "Permission denied"
            })
        }
        return next();
    }
}

module.exports = {
    apiKey,
    permission,
}