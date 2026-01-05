const router = require("express").Router();
const checkLogin = require("../../shared/middlewares/auth.middleware");
const { UserRoles } = require("../../shared/utils/constants");
const noticeCtrl = require("./notice.controller");

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
