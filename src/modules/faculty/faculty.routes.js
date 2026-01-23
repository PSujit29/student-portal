const express = require('express');
const checkLogin = require('../../shared/middlewares/auth.middleware');
const { UserRoles } = require('../../shared/utils/constants');
const facultyCtrl = require('./faculty.controller'); 

const facultyRouter = express.Router();

const requireFaculty = checkLogin([UserRoles.FACULTY]);
const requireAdmin = checkLogin([UserRoles.ADMIN]);

// faculty self profile
facultyRouter
  .route('/me')
  .get(requireFaculty, facultyCtrl.getMyProfile)
  .put(requireFaculty, facultyCtrl.updateMyProfile);

// admin-only listing / creation
facultyRouter
  .route('/')
  .get(requireAdmin, facultyCtrl.getAllFaculty)
  .post(requireAdmin, facultyCtrl.createFaculty);

// admin operations on a specific faculty
facultyRouter
  .route('/:facultyId')
  .get(checkLogin([UserRoles.ADMIN, UserRoles.FACULTY]), facultyCtrl.getFacultyById)
  .patch(requireAdmin, facultyCtrl.updateFacultyByAdmin)
  .delete(requireAdmin, facultyCtrl.deleteFacultyByAdmin);

module.exports = facultyRouter;