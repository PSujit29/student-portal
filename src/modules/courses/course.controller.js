const courseService = require("./course.service");
const { successResponse } = require("../../shared/utils/response.util");

class CourseController {
    async getAllCourses(req, res, next) {
        try {
            const { page, limit, status } = req.query;
            const result = await courseService.listCourses({ page, limit, status });

            return successResponse(res, {
                data: result.data,
                message: "Courses fetched successfully",
                status: "COURSES_LIST_SUCCESS",
                meta: {
                    page: result.page,
                    limit: result.limit,
                    total: result.total,
                },
            });
        } catch (err) {
            next(err);
        }
    }

    async createCourse(req, res, next) {
        try {
            const payload = req.body || {};
            const course = await courseService.createCourse(payload);

            return successResponse(res, {
                data: course,
                message: "Course created successfully",
                status: "COURSE_CREATED",
                code: 201,
            });
        } catch (err) {
            next(err);
        }
    }

    async getCourseDetail(req, res, next) {
        try {
            const { courseId } = req.params;
            const course = await courseService.getCourseById(courseId);

            return successResponse(res, {
                data: course,
                message: "Course detail fetched successfully",
                status: "COURSE_DETAIL_SUCCESS",
            });
        } catch (err) {
            next(err);
        }
    }

    async updateCourse(req, res, next) {
        try {
            const { courseId } = req.params;
            const body = req.body || {};

            const updatePatch = await courseService.updateCourse(courseId, body);

            return successResponse(res, {
                data: updatePatch,
                message: "Course updated successfully",
                status: "COURSE_UPDATED",
            });
        } catch (err) {
            next(err);
        }
    }

    async updateCourseStatus(req, res, next) {
        try {
            const { courseId } = req.params;
            const { status } = req.body || {};
            const result = await courseService.updateCourseStatus(courseId, status);

            return successResponse(res, {
                data: result,
                message: "Course status updated successfully",
                status: "COURSE_STATUS_UPDATED",
            });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new CourseController();
