const courseRouter = require("express").Router();
const checkLogin = require("../../shared/middlewares/auth.middleware");
const bodyValidator = require("../../shared/middlewares/validate.middleware");
const { UserRoles } = require("../../shared/utils/constants");
const courseCtrl = require("./course.controller");
const { createCourseRules, updateCourseRules, updateStatusRules } = require("./course.validation");

// Public or logged-in list of courses
courseRouter.route("/")
    .get(checkLogin(), courseCtrl.getAllCourses) 
    .post(
        checkLogin([UserRoles.ADMIN]),
        bodyValidator(createCourseRules),
        courseCtrl.createCourse
    );

courseRouter.route("/:courseId")
    .get(checkLogin(), courseCtrl.getCourseDetail)
    .patch(
        checkLogin([UserRoles.ADMIN]),
        bodyValidator(updateCourseRules),
        courseCtrl.updateCourse
    );

courseRouter
    .patch(
        "/:courseId/status",
        checkLogin([UserRoles.ADMIN]),
        bodyValidator(updateStatusRules),
        courseCtrl.updateCourseStatus
    );

module.exports = courseRouter;