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
		if (patch.profileTitle) updatePatch.profileTitle = patch.profileTitle;
		if (patch.description) updatePatch.description = patch.description;
		if (patch.creditHours !== undefined) updatePatch.creditHours = patch.creditHours;
		if (patch.status) updatePatch.status = patch.status;

		if (Object.keys(updatePatch).length === 0) {
			const error = new Error("Nothing to update");
			error.code = 400;
			error.status = "NOTHING_TO_UPDATE";
			throw error;
		}

		await ProfileModel.updateOne({ _id: profileId }, { $set: updatePatch });

		return updatePatch;
	}

	async updateProfileStatus(profileId, status) {
		if (!status) {
			const error = new Error("Status is required");
			error.code = 400;
			error.status = "STATUS_REQUIRED";
			throw error;
		}

		if (!Object.values(ProfileStatus).includes(status)) {
			const error = new Error("Invalid status value");
			error.code = 400;
			error.status = "INVALID_STATUS";
			throw error;
		}

		await this.getProfileById(profileId);

		await ProfileModel.updateOne({ _id: profileId }, { $set: { status } });

		return { status };
	}
}

module.exports = new ProfileService();

