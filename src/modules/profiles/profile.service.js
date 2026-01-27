const ProfileModel = require("./profile.model");

class ProfileService {

	async createProfile(payload) {

		const existing = await ProfileModel.findOne({ userId: payload.userId }).lean();
		if (existing) {
			const error = new Error("Profile for this user already exists");
			error.code = 400;
			error.status = "PROFILE_EXISTS";
			throw error;
		}

		const profile = await ProfileModel.create({
			userId: payload.userId,
			fullName: payload.fullName,
			gender: payload.gender,
			phone: payload.phone,
			permanentAddress: payload.permanentAddress,
			dob: payload.dob,
			temporaryAddress: payload.temporaryAddress || null,
			emergencyContactName: payload.emergencyContactName || null,
			emergencyPhone: payload.emergencyPhone || null,
			profilePic: payload.profilePic || null,
			bio: payload.bio || null,
			nationality: payload.nationality || null,
			bloodGroup: payload.bloodGroup || null,
		});

		return profile;
	}

	async viewProfile(userId = null) {
		if (userId === null) {
			const error = new Error("No user id attached to update");
			error.code = 402;
			error.status = "NO_USER_PPROVIDED";
			throw error;
		}
		const profile = await ProfileModel.findOne({ userId })
			.select('-__v -createdAt -updatedAt -userId')
			.lean();


		return {
			data: profile,
		};
	}


	async getProfileById(profileId) {
		if (!profileId) {
			const error = new Error("Profile id is required");
			error.code = 400;
			error.status = "COURSE_ID_REQUIRED";
			throw error;
		}

		const profile = await ProfileModel.findById(profileId);
		if (!profile) {
			const error = new Error("Profile not found");
			error.code = 404;
			error.status = "COURSE_NOT_FOUND";
			throw error;
		}

		return profile;
	}

	async updateProfile(userId, patch = {}) {

		const updatePatch = {};
		const allowedFields = [
			'phone', 'temporaryAddress', 'emergencyContactName',
			'emergencyPhone', 'profilePic', 'bio', 'bloodGroup', 'nationality'
		];

		allowedFields.forEach(field => {
			if (patch[field]) updatePatch[field] = patch[field];
		});


		//  cloudinary ??

		if (Object.keys(updatePatch).length === 0) {
			const error = new Error("Nothing to update");
			error.code = 400;
			error.status = "NOTHING_TO_UPDATE";
			throw error;
		}

		await ProfileModel.updateOne({ userId: userId }, { $set: updatePatch });

		return updatePatch;
	}

	async updateProfileByAdmin(userId, patch = {}) {
		if (!userId) {
			const error = new Error("User id is required");
			error.code = 400;
			error.status = "USER_ID_REQUIRED";
			throw error;
		}

		const profile = await ProfileModel.findOne({ userId });
		if (!profile) {
			const error = new Error("Profile not found for this user");
			error.code = 404;
			error.status = "PROFILE_NOT_FOUND_FOR_USER";
			throw error;
		}

		return this.updateProfile(profile._id, patch);
	}

	async getAllProfiles({ page = 1, limit = 10 } = {}) {
		const pageNumber = Number(page) || 1;
		const pageSize = Number(limit) || 10;
		const skip = (pageNumber - 1) * pageSize;

		const [profiles, total] = await Promise.all([
			ProfileModel.find({}).sort({ createdAt: 1 }).skip(skip).limit(pageSize),
			ProfileModel.countDocuments({}),
		]);

		return {
			data: profiles,
			page: pageNumber,
			limit: pageSize,
			total,
		};
	}

}

module.exports = new ProfileService();

