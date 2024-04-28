const { Router } = require("express");
const router = Router();
const {verifyToken,verifyAdmin} = require("../middlewares/auth");
const upload = require("../middlewares/multer");

const {
  registerUser,
  loginUser,
  logoutUser,
  CurrentUser,
  TokenInfo,
  verify,
  UpdateUser,
  ferchUsers,
  UpdatePassword,
  UpdateUserRole,
  DeleteUser,
  resendEmail
} = require("../controllers/userControler");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.get("/resendEmail", resendEmail);
router.get("/users/:userId/verify/:token", verify);
router.get("/userbytoken", TokenInfo);
router.get("/user/:id", CurrentUser);
router.get("/verify-session", verifyToken, (req, res) => {res.sendStatus(200);});
router.get("/verify-admin", verifyAdmin, (req, res) => {res.sendStatus(200);});
router.put("/user/update/:userId", upload.single("avatar"), UpdateUser );
router.put("/user/update/role/:userId", UpdateUserRole );
router.put("/user/update/password/:id", UpdatePassword);
router.get("/users",ferchUsers);
router.delete("/users/:userId", DeleteUser);
module.exports = router;
