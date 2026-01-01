const ProfileModel = require("./profile.model");

class ProfileService {
	async viewProfile(userId = null) {
		if (userId === null) {

		}
		const profile = await
			ProfileModel.findOne({ userId: userId });

		return {
			data: profile,
		};
	}


	async updateProfile(profileId, patch = {}) {
		await this.getProfileById(profileId);

		const updatePatch = {};
		if (Object.prototype.hasOwnProperty.call(patch, "phone")) {
			updatePatch.phone = patch.phone;
		}
		if (Object.prototype.hasOwnProperty.call(patch, "address")) {
			updatePatch.address = patch.address;
		}
		if (Object.prototype.hasOwnProperty.call(patch, "bio")) {
			updatePatch.bio = patch.bio;
		}
		if (Object.prototype.hasOwnProperty.call(patch, "profilePic")) {
			updatePatch.profilePic = patch.profilePic;
		}

		if (Object.keys(updatePatch).length === 0) {
			const error = new Error("Nothing to update");
			error.code = 400;
			error.status = "NOTHING_TO_UPDATE";
			throw error;
		}

		await ProfileModel.updateOne({ _id: profileId }, { $set: updatePatch });

		return updatePatch;
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

	async listProfiles({ page = 1, limit = 10 } = {}) {
		const pageNumber = Number(page) || 1;
		const pageSize = Number(limit) || 10;
		const skip = (pageNumber - 1) * pageSize;

		const filter = {};

		const [courses, total] = await Promise.all([
			ProfileModel.find(filter).sort({ createdAt: 1 }).skip(skip).limit(pageSize).lean(),
			ProfileModel.countDocuments(filter),
		]);

		return {
			data: courses,
			page: pageNumber,
			limit: pageSize,
			total,
		};
	}

	async viewUserProfileById(userId) {
		if (!userId) {
			const error = new Error("user id is required");
			error.code = 400;
			error.status = "USER_ID_REQUIRED";
			throw error;
		}

		const profile = await ProfileModel.findOne({ userId: userId });
		if (!profile) {
			const error = new Error("user profile not found");
			error.code = 404;
			error.status = "USER_PROFILE_NOT_FOUND";
			throw error;
		}

		return this.getProfileById(profile._id);
	}

	async updateProfileAdmin(userId, patch = {}) {
		if (!userId) {
			const error = new Error("user id is required");
			error.code = 400;
			error.status = "USER_ID_REQUIRED";
			throw error;
		}

		const profile = await ProfileModel.findOne({ userId: userId });
		if (!profile) {
			const error = new Error("user profile not found");
			error.code = 404;
			error.status = "USER_PROFILE_NOT_FOUND";
			throw error;
		}
		const profileId = profile._id;
		await this.getProfileById(profileId);

		const updatePatch = {};
		if (Object.prototype.hasOwnProperty.call(patch, "phone")) {
			updatePatch.phone = patch.phone;
		}
		if (Object.prototype.hasOwnProperty.call(patch, "address")) {
			updatePatch.address = patch.address;
		}
		if (Object.prototype.hasOwnProperty.call(patch, "bio")) {
			updatePatch.bio = patch.bio;
		}
		if (Object.prototype.hasOwnProperty.call(patch, "profilePic")) {
			updatePatch.profilePic = patch.profilePic;
		}

		if (Object.keys(updatePatch).length === 0) {
			const error = new Error("Nothing to update");
			error.code = 400;
			error.status = "NOTHING_TO_UPDATE";
			throw error;
		}

		await ProfileModel.updateOne({ _id: profileId }, { $set: updatePatch });

		return updatePatch;

	}

}

module.exports = new ProfileService();

