'use strict'

const { unGetSelectData, getSelectData } = require("../../utils")

const findAllDiscountCodesUnSelect = async ({
    limit = 50, page = 1, sort = 'ctime',
    filter, unSelect, model
}) => {
    const skip = (page -1) * limit
    const sortBy = sort === 'ctime' ? {_id: -1} : {_id: 1}
    const documents = await model.find(filter)
                                .sort(sortBy)
                                .skip(skip)
                                .limit(limit)
                                .select(unGetSelectData(unSelect))
                                .lean()
                                .exec()
    return documents
}

const findAllDiscountCodesSelect = async ({
    limit = 50, page = 1, sort = 'ctime',
    filter, unSelect, model
}) => {
    const skip = (page -1) * limit
    const sortBy = sort === 'ctime' ? {_id: -1} : {_id: 1}
    const documents = await model.find(filter)
                                .sort(sortBy)
                                .skip(skip)
                                .limit(limit)
                                .select(getSelectData(unSelect))
                                .lean()
                                .exec()
    return documents
}

module.exports = {
    findAllDiscountCodesUnSelect,
    findAllDiscountCodesSelect
}