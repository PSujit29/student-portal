const mongoose = require('mongoose');
const { createBaseSchema } = require('../../shared/models/base.model');

const noticeReceiptSchema = createBaseSchema({
    noticeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Notice',
        required: true,
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    isRead: {
        type: Boolean,
        default: false,
    },

    readAt: {
        type: Date,
        default: null,
    },

});

noticeReceiptSchema.pre('save', function (next) {
    if (this.isRead && !this.readAt) {
        this.readAt = new Date();
    }

    if (!this.isRead) {
        this.readAt = null;
    }

    next();
});

noticeReceiptSchema.index(
    { noticeId: 1, userId: 1 },
    { unique: true }
);

const NoticeReceiptModel = mongoose.model('NoticeReceipt', noticeReceiptSchema);

module.exports = NoticeReceiptModel;
