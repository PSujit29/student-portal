const Genders = {
    MALE: "male",
    FEMALE: "female",
    OTHERS: "others"
}

const UserRoles = {
    ADMIN: "admin", //admin only
    STUDENT: "student",
    TEACHER: "teacher",
    APPLICANT: "applicant", //for admission process 
}
const Status = {
    ACTIVE: "active", //is currently studying activey
    RESTICATED: "resticated", //removed from college
    GRADUATED: "graduated", //successfully completed the bachelors or relevant degree
    WITHDRAWN: "withdrawn" //withdrawn mid college
}
const NonActiveStatuses = {
    RESTICATED: "resticated", //removed from college
    GRADUATED: "graduated", //successfully completed the bachelors or relevant degree
    WITHDRAWN: "withdrawn" //withdrawn mid college   
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

module.exports = {
    Genders,
    UserRoles,
    ApplicationStatus,
    Programme,
    Relations,
    Status,
    NonActiveStatuses
}