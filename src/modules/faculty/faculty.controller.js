const facultyService = require('./faculty.service')

class FacultyController {
    // { populate course

    //  Controller Example
    // const faculty = await FacultyModel.findById(id).populate('assignedCourses');

    // The resulting JSON will look like this:
    // {
    //   "employeeCode": "FAC101",
    //   "assignedCourses": [
    //      { "courseCode": "CSC109", "courseTitle": "Introduction to IT", ... }
    //   ]
    // }

    // }

    async createFaculty(req, res, next) {
        try {
            const payload = req.body;
            const faculty = await facultyService.createFaculty(payload);

            return res.status(201).json({
                success: true,
                data: faculty,
                message: "Faculty created successfully",
            });
        } catch (err) {
            next(err);
        }
    }

    async getAllFaculty(req, res, next) {
        try {
            const { page, limit } = req.query;
            const result = await facultyService.listFaculties({ page, limit });

            return res.status(200).json({
                success: true,
                data: result,
                message: "All Faculties Profile"
            });
        } catch (err) {
            next(err);
        }
    }

    async getFacultyById(req, res, next) {
        try {
            const facultyId = req.params?.facultyId;
            const faculty = await facultyService.getFacultyById(facultyId);
            res.json({
                success: true,
                message: 'getFacultyDetail by admin',
                faculty,
                status: 'TEST_GET_STUDENT_DETAIL'
            });
        } catch (err) {
            next(err);
        }
    }

    async getMyProfile(req, res, next) {
        try {
            const userId = req.loggedInUser?._id;
            const { faculty } = await facultyService.getFacultyProfile(userId);

            return res.status(200).json({
                success: true,
                faculty,
                message: "Your Faculty Profile"
            });
        } catch (err) {
            next(err);
        }
    }

    async updateMyProfile(req, res, next) {
        try {
            const userId = req.loggedInUser?._id;
            const updatePayload = req.body || {};

            const updatedFaculty = await facultyService.updateFaculty(userId, updatePayload);

            return res.status(200).json({
                success: true,
                data: updatedFaculty,
                message: "Faculty updated successfully"
            });

        } catch (err) {
            next(err);
        }
    }

    async updateFacultyByAdmin(req, res, next) {
        try {
            const { facultyId } = req.params;
            const updatedFaculty = await facultyService.updateFaculty(facultyId, req.body);

            return res.status(200).json({
                success: true,
                data: updatedFaculty,
                message: "Faculty updated successfully"
            });
        } catch (err) {
            next(err);
        }
    }

    async deleteFacultyByAdmin(req, res, next) {
        // TODO: Complete this once all dependencies has been clear , done and dusted
        // return in future
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