const Student = require('../models/student.model');

const getLoggedInStudent = () => {
  return async (req, res, next) => {
    try {
      const user = req.loggedInUser; // set by checkLogin
      if (!user) return res.status(401).json({ message: 'Not authenticated' });

      const student = await Student.findOne({ userId: user._id });
      if (!student) return res.status(404).json({ message: 'Student not found' });

      req.loggedInStudent = student;
      next();
    } catch (err) {
      next(err);
    }
  }
};

module.exports = getLoggedInStudent;