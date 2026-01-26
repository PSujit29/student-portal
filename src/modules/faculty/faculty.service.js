const FacultyModel = require("./faculty.model");
const ProfileModel = require("../profiles/profile.model")
class FacultyService {

	async createFaculty(payload = {}) {
		const { userId, department, assignedCourses, designation, officeHours, qualifications, status } = payload;

		const existing = await FacultyModel.findOne({ userId });
		if (existing) {
			throw { code: 409, message: "Faculty already exists", status: "FACULTY_ALREADY_EXISTS" };
		}

		const facultyData = {
			userId,
			department,
			designation,
			status: status || 'active'
		};

		//optional fields
		if (assignedCourses) facultyData.assignedCourses = assignedCourses;
		if (officeHours) facultyData.officeHours = officeHours;
		if (qualifications) facultyData.qualifications = qualifications;


		const faculty = await FacultyModel.create(facultyData);
		return faculty
	}

	async listFaculties({ page = 1, limit = 10, status } = {}) {
		const pageNumber = Number(page) || 1;
		const pageSize = Number(limit) || 10;
		const skip = (pageNumber - 1) * pageSize;

		const filter = {};
		if (status) {
			filter.status = status;
		}

		const [faculties, total] = await Promise.all([
			FacultyModel.find(filter).sort({ createdAt: 1 }).skip(skip).limit(pageSize).lean(),
			FacultyModel.countDocuments(filter),
		]);

		return {
			data: faculties,
			page: pageNumber,
			limit: pageSize,
			total,
		};
	}

	async getFacultyById(facultyId) {
		const faculty = await FacultyModel.findById(facultyId)
			.select('-__v') //fetch all except version 
			.populate({
				path: 'userId',
				select: 'email role accountStatus lastLoginAt',
			})
			.lean();

		if (!faculty) {
			throw { code: 404, message: "Faculty not found", status: "FACULTY_NOT_FOUND" };
		}

		// Profile is separate and linked via userId:
		const profile = await ProfileModel.findOne({ userId: faculty.userId })
			.select('fullName phone address profilePic bio')
			.lean();

		return {
			...faculty,
			profile: profile || null
		};
	}

	async updateFaculty(userId, patch = {}) {
		const faculty = await FacultyModel.findOne({ userId });
		if (!faculty) {
			throw { code: 404, message: "Faculty not found", status: "NOT_FOUND" };
		}

		if (patch.qualifications !== undefined) {
			faculty.qualifications = patch.qualifications;
		}

		await faculty.save();
		return faculty;
	}


	async updateFacultyByAdmin(userId, patch = {}) {
		const faculty = await FacultyModel.findOne({ userId });
		if (!faculty) {
			throw { code: 404, message: "Faculty not found", status: "NOT_FOUND" };
		}

		const allowedFields = ["department", "designation", "status", "assignedCourses",];

		allowedFields.forEach(field => {
			if (patch[field] !== undefined) {
				faculty[field] = patch[field];
			}
		});

		await faculty.save();
		return faculty;

	}

	async getFacultyProfile(userId) {
		if (!userId) {
			throw { code: 400, message: "User ID is required", status: "USER_ID_REQUIRED" };
		}
		const faculty = await FacultyModel.findOne({ userId })
			.select('department assignedCourses designation officeHours qualifications -_id')
			.lean();
		return { faculty };
	}
}

module.exports = new FacultyService();

