const ProfileModel = require("./profile.model");

class ProfileService {
	async viewProfile(userId = null) {
		if (userId === null) {
			const error = new Error("No user id attached to update");
			error.code = 402;
			error.status = "NO_USER_PPROVIDED";
			throw error;
		}
		const profile = await
			ProfileModel.findOne({ userId: userId });

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

	async updateProfile(profileId, patch = {}) {
		await this.getProfileById(profileId);

		const updatePatch = {};
		if (patch.phone) updatePatch.phone = patch.phone;
		if (patch.address) updatePatch.address = patch.address;
		if (patch.profilePic) updatePatch.profilePic = patch.profilePic;
		if (patch.bio) updatePatch.bio = patch.bio;
		//  cloudinary ??

		if (Object.keys(updatePatch).length === 0) {
			const error = new Error("Nothing to update");
			error.code = 400;
			error.status = "NOTHING_TO_UPDATE";
			throw error;
		}

		await ProfileModel.updateOne({ _id: profileId }, { $set: updatePatch });

		return updatePatch;
	}

	async updateProfileByAdmin(userId, patch = {}) {
		const profile = await ProfileModel.findOne({ userId: userId });
		await this.getProfileById(profile.profileId)
		return await this.updateProfile(profile.profileId, patch)
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

