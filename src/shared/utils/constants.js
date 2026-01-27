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

// Account lifecycle / authentication state
const AccountStatus = {
    ACTIVE: 'active',
    LOCKED: 'locked',
    SUSPENDED: 'suspended',
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

const AudienceType = {
    ALL: "all", // all relevant users (e.g. all students)
    COURSE: "course", // users related to a specific course
    SPECIFIC_USERS: "specific_users", // explicit list of userIds
}
const Designation = {
    PROFESSOR: "professor",
    LECTURER: "lecturer",
    COORDINATOR: "coordinator",
    HOD: "hod"
};

const CourseStatus = {
    ACTIVE: "active",
    ARCHIVED: "archived",
}

const CourseCategory = {
    THEORY: "theory",
    LAB: "lab",
}

const EnrollmentStatus = {
    ENROLLED: "enrolled",
    WITHDRAWN: "withdrawn",
    COMPLETED: "completed",
    FAILED: "failed",
}

const TransferStatus = {
    ACTIVE: "active",
    REVOKED: "revoked",
}
const BloodGroups = {
    A_POS: "A+",
    A_NEG: "A-",    
    B_POS: "B+",
    B_NEG: "B-",
    AB_POS: "AB+",
    AB_NEG: "AB-",
    O_POS: "O+",
    O_NEG: "O-",
}

module.exports = {
    Genders,
    UserRoles,
    AccountStatus,
    Programme,
    Relations,
    Status,
    NonActiveStatuses,
    AudienceType,
    CourseStatus,
    CourseCategory,
    EnrollmentStatus,
    TransferStatus,
    Designation,
    BloodGroups
}