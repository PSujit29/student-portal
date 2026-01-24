

class FacultyController {

    async createFaculty(req, res, next) {
        try {
            res.json({
                success: true,
                data: {
                    faculty: { _id: "stub_id", name: "John Doe", status: "ACTIVE" }
                },
                message: 'getMyProfile stub',
                status: 'TEST_GET_MY_PROFILE'
            });
        } catch (err) {
            next(err);
        }
    }

    async getAllFaculty(req, res, next) {
        try {
            const page = +req.query.page || 1;
            const limit = +req.query.limit || 10;

            res.json({
                success: true,
                data: [
                    { _id: "1", name: "Faculty A", status: "ACTIVE" },
                    { _id: "2", name: "Faculty B", status: "ACTIVE" }
                ],
                page,
                limit,
                message: 'getAllFaclulty success (stub)',
                status: 'TEST_GET_ALL_FACULTY'
            });
        } catch (err) {
            next(err);
        }
    }

    async getFacultyById(req, res, next) {
        try {
            const { facultyId } = req.params;
            res.json({
                success: true,
                message: 'getFacultyDetail by admin (stub)',
                data: { _id: facultyId || "stub_id", name: "Stub Faculty" },
                status: 'TEST_GET_FACULTY_DETAIL'
            });
        } catch (err) {
            next(err);
        }
    }
    async getMyProfile(req, res, next) {
        try {
            const { facultyId } = req.params;
            res.json({
                success: true,
                message: 'getMyProfile (stub)',
                data: { _id: facultyId || "stub_id", name: "Stub Faculty" },
                status: 'TEST_GET_FACULTY_DETAIL'
            });
        } catch (err) {
            next(err);
        }
    }

    async updateMyProfile(req, res, next) {
        try {
            const updatePayload = req.body || {};
            res.json({
                success: true,
                applicantPatch: updatePayload,
                message: "Profile updated successfully (stub)",
                status: "PROFILE_UPDATED"
            });
        } catch (err) {
            next(err);
        }
    }
    
    async updateFacultyByAdmin(req, res, next) {
        try {
            const updatePayload = req.body || {};
            res.json({
                success: true,
                applicantPatch: updatePayload,
                message: "Profile updated successfully (stub)",
                status: "PROFILE_UPDATED"
            });
        } catch (err) {
            next(err);
        }
    }

    async deleteFacultyByAdmin(req, res, next) {
        try {
            const { facultyId } = req.params;
            const reason = req.body.reason || "No reason provided";

            res.json({
                success: true,
                facultyPatch: { status: reason },
                userPatch: { isActive: false },
                message: `deleteFacultyByAdmin (stub) for ID: ${facultyId}`,
                status: 'TEST_DELETE_FACULTY_BY_ADMIN'
            });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new FacultyController()