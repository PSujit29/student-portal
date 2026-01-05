const mongoose = require('mongoose');
const { createBaseSchema } = require('../../shared/models/base.model');
const { AudienceType } = require('../../shared/utils/constants');

const noticeSchema = createBaseSchema({
    title: {
        type: String,
        required: [true, 'Notice Title is a must.'],
        minlength: 1,
        maxlength: [128, 'Title cannot exceed 128 characters'],
        trim: true,
    },

    subject: {
        type: String,
        minlength: 1,
        maxlength: [256, 'Subject cannot exceed 256 characters'],
        trim: true,
        default: null,
    },

    body: {
        type: String,
        required: [true, 'Notice Body is a must.'],
        trim: true,
        minlength: 1,
        maxlength: [50000, 'Body cannot exceed 50,000 characters.'],
    },

    // admin | faculty userId
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    audienceType: {
        type: String,
        enum: Object.values(AudienceType),
        required: true,
    },

    // if audienceType === COURSE
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: function () {
            return this.audienceType === AudienceType.COURSE;
        },
        default: null,
    },

    // optional course context 
    batch: {
        type: String,
        default: null,
        trim: true,
    },
    semester: {
        type: Number,
        min: 1,
        max: 8,
        default: null,
    },
    section: {
        type: String,
        default: null,
        trim: true,
    },

    // for SPECIFIC_USERS audience type
    specificUserIds: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],

    // validity / expiry period
    validFrom: {
        type: Date,
        default: Date.now,
    },
    validUntil: {
        type: Date,
        default: null,
    },
}
);

// Indexes for common notice query patterns
noticeSchema.index({ audienceType: 1 });
noticeSchema.index({ courseId: 1 });
noticeSchema.index({ createdBy: 1, createdAt: -1 });

// Index to support course + batch + semester queries
noticeSchema.index({ courseId: 1, batch: 1, semester: 1 });

// Validate audience-specific fields
noticeSchema.pre('validate', function (next) {
    if (this.audienceType !== AudienceType.SPECIFIC_USERS && Array.isArray(this.specificUserIds) && this.specificUserIds.length > 0) {
        return next(new Error('specificUserIds can only be set when audienceType is SPECIFIC_USERS'));
    }

    if (this.audienceType === AudienceType.SPECIFIC_USERS && (!Array.isArray(this.specificUserIds) || this.specificUserIds.length === 0)) {
        return next(new Error('specificUserIds is required when audienceType is SPECIFIC_USERS'));
    }

    if (this.audienceType !== AudienceType.COURSE && this.courseId) {
        return next(new Error('courseId can only be set when audienceType is COURSE'));
    }

    if (this.validUntil && this.validFrom && this.validUntil < this.validFrom) {
        return next(new Error('validUntil must be greater than or equal to validFrom'));
    }

    next();
});

const NoticeModel = mongoose.model('Notice', noticeSchema);

module.exports = NoticeModel;