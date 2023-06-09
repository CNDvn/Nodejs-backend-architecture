'use strict'

const {product, electronic, clothing, furniture} = require('../../models/product.model')
const {Types} = require("mongoose")

const findAllDraftsForShop = async ({query, limit, skip}) => {
    return await queryProduct({query, limit, skip})
}

const findAllPublishForShop = async ({query, limit, skip}) => {
    return await queryProduct({query, limit, skip})
}

const searchProductByUser = async ({keySearch}) => {
    const regexSearch = new RegExp(keySearch)
    const result = await product.find(
        {
            isDraft: false,
            $text:{$search: regexSearch}
        },
        {score:{$meta:'textScore'}})
        .sort({score:{$meta:'textScore'}})
        .lean()

    return result
}

const publishProductByShop = async ({product_shop, product_id}) => {
    const foundShop = await product.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id)
    })

    if(!foundShop) return null
    foundShop.isDraft = false 
    foundShop.isPublished = true
    const {modifiedCount} = await foundShop.update(foundShop)
    
    return modifiedCount
}

const unPublishProductByShop = async ({product_shop, product_id}) => {
    const foundShop = await product.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id)
    })

    if(!foundShop) return null
    foundShop.isDraft = true 
    foundShop.isPublished = false
    const {modifiedCount} = await foundShop.update(foundShop)
    
    return modifiedCount
}



const queryProduct = async ({query, limit, skip}) => {
    return await product.find(query)
                        .populate('product_shop', 'name email -_id')
                        .sort({updateAt: -1})
                        .skip(skip)
                        .limit(limit)
                        .exec()
}

module.exports = {
    findAllDraftsForShop,
    publishProductByShop,
    findAllPublishForShop,
    unPublishProductByShop,
    searchProductByUser
}