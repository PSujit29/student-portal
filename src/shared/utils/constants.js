const Genders = {
    MALE: "male",
    FEMALE: "female",
    OTHERS: "others"
}

const UserRoles = {
    ADMIN: "admin", //admin only
    STUDENT: "student",
    FACULTY: "faculty",
}

const Status = {
    ACTIVE: "active", //is currently studying activey
    WITHDRAWN: "withdrawn", //withdrawn mid college
    DISMISSED: "dismissed", //removed from college
    TRANSFERRED_OUT: "transferred_out", //took transfer
    GRADUATED: "graduated" //successfully completed the bachelors or relevant degree
}

// Helper subset for statuses that mean the student is no longer actively studying
const NonActiveStatuses = {
    WITHDRAWN: Status.WITHDRAWN,
    DISMISSED: Status.DISMISSED,
    TRANSFERRED_OUT: Status.TRANSFERRED_OUT,
    GRADUATED: Status.GRADUATED,
}

const ApplicationStatus = {
    UNDER_REVIEW: "under_review",
    ACCEPTED: "accepted",
    REJECTED: "rejected"
}

const Programme = {
    CSIT: "csit",
    BCA: "bca",
    BIT: "bit"
}

const Relations = {
    FATHER: "father",
    MOTHER: 'mother',
    SIBLINGS: 'sibling',
    GUARDIAN: 'guardian',
}

// Course status (curriculum lifecycle)
const CourseStatus = {
    ACTIVE: "active",
    ARCHIVED: "archived",
}

// Course / curriculum category (how a course is delivered)
const CourseCategory = {
    THEORY: "theory",
    LAB: "lab",
}

// Enrollment status (per-course student progress)
const EnrollmentStatus = {
    ENROLLED: "enrolled",
    WITHDRAWN: "withdrawn",
    COMPLETED: "completed",
    FAILED: "failed",
}

// Transfer credit status
const TransferStatus = {
    ACTIVE: "active",
    REVOKED: "revoked",
}

module.exports = {
    Genders,
    UserRoles,
    ApplicationStatus,
    Programme,
    Relations,
    Status,
    NonActiveStatuses,
    CourseStatus,
    CourseCategory,
    EnrollmentStatus,
    TransferStatus,
}