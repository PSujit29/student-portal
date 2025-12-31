const CourseModel = require("./course.model");
const { CourseStatus } = require("../../shared/utils/constants");

class CourseService {
	async listCourses({ page = 1, limit = 10, status } = {}) {
		const pageNumber = Number(page) || 1;
		const pageSize = Number(limit) || 10;
		const skip = (pageNumber - 1) * pageSize;

		const filter = {};
		if (status) {
			filter.status = status;
		}

		const [courses, total] = await Promise.all([
			CourseModel.find(filter).sort({ createdAt: 1 }).skip(skip).limit(pageSize),
			CourseModel.countDocuments(filter),
		]);

		return {
			data: courses,
			page: pageNumber,
			limit: pageSize,
			total,
		};
	}

	async createCourse(payload = {}) {
		const existing = await CourseModel.findOne({ courseCode: payload.courseCode });
		if (existing) {
			const error = new Error("Course with this code already exists");
			error.code = 400;
			error.status = "COURSE_CODE_EXISTS";
			throw error;
		}

		const course = await CourseModel.create({
			courseCode: payload.courseCode,
			courseTitle: payload.courseTitle,
			description: payload.description,
			creditHours: payload.creditHours,
			status: payload.status || CourseStatus.ACTIVE,
		});

		return course;
	}

	async getCourseById(courseId) {
		if (!courseId) {
			const error = new Error("Course id is required");
			error.code = 400;
			error.status = "COURSE_ID_REQUIRED";
			throw error;
		}

		const course = await CourseModel.findById(courseId);
		if (!course) {
			const error = new Error("Course not found");
			error.code = 404;
			error.status = "COURSE_NOT_FOUND";
			throw error;
		}

		return course;
	}

	async updateCourse(courseId, patch = {}) {
		await this.getCourseById(courseId);

		const updatePatch = {};
		if (patch.courseTitle) updatePatch.courseTitle = patch.courseTitle;
		if (patch.description) updatePatch.description = patch.description;
		if (patch.creditHours !== undefined) updatePatch.creditHours = patch.creditHours;
		if (patch.status) updatePatch.status = patch.status;

		if (Object.keys(updatePatch).length === 0) {
			const error = new Error("Nothing to update");
			error.code = 400;
			error.status = "NOTHING_TO_UPDATE";
			throw error;
		}

		await CourseModel.updateOne({ _id: courseId }, { $set: updatePatch });

		return updatePatch;
	}

	async updateCourseStatus(courseId, status) {
		if (!status) {
			const error = new Error("Status is required");
			error.code = 400;
			error.status = "STATUS_REQUIRED";
			throw error;
		}

		if (!Object.values(CourseStatus).includes(status)) {
			const error = new Error("Invalid status value");
			error.code = 400;
			error.status = "INVALID_STATUS";
			throw error;
		}

		await this.getCourseById(courseId);

		await CourseModel.updateOne({ _id: courseId }, { $set: { status } });

		return { status };
	}
}

module.exports = new CourseService();

