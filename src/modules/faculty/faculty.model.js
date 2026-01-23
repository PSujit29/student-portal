const facultySchema = createBaseSchema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    employeeCode: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    department: {
        type: String,
        required: true,
        trim: true,
    },
    designation: {
        type: String, // e.g., "Assistant Professor", "Dean"
        required: true,
        trim: true,
    },
    // --- MVP ADDITIONS FOR STUDENT INTERACTION ---
    officeLocation: {
        type: String, // e.g., "Building B, Room 402"
        required: true,
    },
    officeHours: {
        type: String, // Text-based for MVP (e.g., "Mon/Wed 2-4 PM")
    },
    researchInterests: [{
        type: String, // Helps students find mentors
    }],
    qualifications: [{
        type: String, // e.g., "PhD in Computer Science"
    }],
    // ----------------------------------------------
    status: {
        type: String,
        enum: Object.values(Status),
        default: Status.ACTIVE,
    },
});

facultySchema.index({ department: 1 });
facultySchema.index({ researchInterests: 1 }); // Index for student searches
