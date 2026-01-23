const router = require("express").Router();
const checkLogin = require("../../shared/middlewares/auth.middleware");
const { UserRoles } = require("../../shared/utils/constants");
const noticeCtrl = require("./notice.controller");


//old use
// INBOX (student + faculty)
router.get("/inbox", checkLogin([UserRoles.STUDENT, UserRoles.FACULTY]), noticeCtrl.getInbox);
router.get("/inbox/:noticeId", checkLogin([UserRoles.STUDENT, UserRoles.FACULTY]), noticeCtrl.getInboxNotice);
router.patch("/:noticeId/read", checkLogin([UserRoles.STUDENT, UserRoles.FACULTY]), noticeCtrl.markRead);

// ADMIN / FACULTY CRUD
router.post("/", checkLogin([UserRoles.ADMIN, UserRoles.FACULTY]), noticeCtrl.create);
router.get("/my", checkLogin([UserRoles.ADMIN, UserRoles.FACULTY]), noticeCtrl.listMine);
router.put("/:noticeId", checkLogin([UserRoles.ADMIN, UserRoles.FACULTY]), noticeCtrl.update);
router.delete("/:noticeId", checkLogin([UserRoles.ADMIN, UserRoles.FACULTY]), noticeCtrl.remove);

// RECEIPTS / ANALYTICS
router.get("/:noticeId/receipts", checkLogin([UserRoles.ADMIN, UserRoles.FACULTY]), noticeCtrl.listReceipts);
router.get("/:noticeId/receipts/users", checkLogin([UserRoles.ADMIN, UserRoles.FACULTY]), noticeCtrl.listReceiptUsers);

// ADMIN ONLY
router.get("/admin/notices", checkLogin([UserRoles.ADMIN]), noticeCtrl.listAll);
router.delete("/admin/users/:userId/notices", checkLogin([UserRoles.ADMIN]), noticeCtrl.deleteUserNotices);

module.exports = router;

// notice.routes.js
// new proposed: 
// // Admin/Faculty endpoints
// POST   /api/notices              // Create notice
// GET    /api/notices              // Get all notices (admin view)
// GET    /api/notices/:id          // Get specific notice
// PUT    /api/notices/:id          // Update notice
// DELETE /api/notices/:id          // Delete notice

// // Student endpoints
// GET    /api/notices/my           // Get my notices (with receipts)
// GET    /api/notices/my/unread    // Get unread notices
// PUT    /api/notices/:id/read     // Mark as read
// GET    /api/notices/:id/details  // Get notice details