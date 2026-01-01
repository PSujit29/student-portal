const courseService = require("./course.service");

class CourseController {
    async getAllCourses(req, res, next) {
        try {
            const { page, limit, status } = req.query;
            const result = await courseService.listCourses({ page, limit, status });

            return res.status(200).json({
                data: result.data,
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

            return res.status(201).json({
                data: course,
            });
        } catch (err) {
            next(err);
        }
    }

    async getCourseDetail(req, res, next) {
        try {
            const { courseId } = req.params;
            const course = await courseService.getCourseById(courseId);

            return res.status(200).json({
                data: course,
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

            return res.status(200).json({
                data: updatePatch,
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

            return res.status(200).json({
                data: result,
            });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new CourseController();
