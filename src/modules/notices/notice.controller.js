// In notice.service.js

async function createNotice(noticeData) {
    // 1. Create the notice
    const notice = await NoticeModel.create(noticeData);
    
    // 2. Resolve audience (get target user IDs)
    const targetUserIds = await resolveAudience(
        notice.audienceType,
        notice.courseId,
        notice.specificUserIds
    );
    
    // 3. Create receipts for all target users
    await createNoticeReceipts(notice._id, targetUserIds);
    
    // 4. Optional: Send notifications
    await sendNotifications(targetUserIds, notice);
    
    return notice;
}

async function resolveAudience(audienceType, courseId, specificUserIds) {
    let userIds = [];
    
    switch(audienceType) {
        case AudienceType.ALL:
            // Get all active students
            const students = await StudentModel.find({ 
                status: Status.ACTIVE,
                isDeleted: false 
            });
            userIds = students.map(s => s.userId);
            break;
            
        case AudienceType.COURSE:
            // Get students enrolled in this course
            const enrollments = await EnrollmentModel.find({
                courseId: courseId,
                enrollmentStatus: EnrollmentStatus.ENROLLED
            });
            userIds = enrollments.map(e => e.studentId);
            break;
            
        case AudienceType.SPECIFIC_USERS:
            userIds = specificUserIds;
            break;
    }
    
    return userIds;
}

async function createNoticeReceipts(noticeId, userIds) {
    const receipts = userIds.map(userId => ({
        noticeId,
        userId,
        deliveredAt: new Date(),
        readAt: null
    }));
    
    // Bulk insert for performance
    await NoticeReceiptModel.insertMany(receipts, { ordered: false });
}
// Get notices for a specific user
async function getUserNotices(userId, filters = {}) {
    const { page = 1, limit = 20, unreadOnly = false } = filters;
    
    // Build query
    const query = { userId };
    if (unreadOnly) {
        query.readAt = null;
    }
    
    const receipts = await NoticeReceiptModel.find(query)
        .populate({
            path: 'noticeId',
            populate: {
                path: 'createdBy',
                select: 'email role'
            }
        })
        .sort({ deliveredAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);
    
    return receipts;
}
async function markAsRead(noticeId, userId) {
    return await NoticeReceiptModel.findOneAndUpdate(
        { noticeId, userId, readAt: null },
        { readAt: new Date() },
        { new: true }
    );
}