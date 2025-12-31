const mongoose = require('mongoose');

const defaultOptions = {
    timestamps: true,
    autoIndex: true,
    autoCreate: true,
};

const commonFields = {
    isDeleted: {
        type: Boolean,
        default: false,
    },
    deletedAt: {
        type: Date,
        default: null,
    },
};

function createBaseSchema(fields, options = {}) {
    return new mongoose.Schema(
        {
            ...fields,
            ...commonFields,
        },
        {
            ...defaultOptions,
            ...options,
        }
    );
}

module.exports = {
    createBaseSchema,
};