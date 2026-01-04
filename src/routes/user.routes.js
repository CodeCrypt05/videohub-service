import { Router } from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUserProfile,
  updateCurruntUserAvatar,
  updateCurrentUserCoverImg,
  updateCurrentUserProfile,
  getUserChannelProfile,
  getWatchHistory,
} from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.js";
import {
  registerUserSchema,
  loginUserSchema,
  changeCurrentPasswordSchema,
  updateCurrentUserProfileSchema,
  getUserChannelProfileSchema,
} from "../validations/user.validation.js";

const router = Router();

// 1. Register
router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  validate(registerUserSchema),
  registerUser
);
// 2. Login
router.route("/login").post(validate(loginUserSchema), loginUser);
// 3. Logout
router.route("/logout").post(verifyJWT, logoutUser);
// 4. refresh access token
router.route("/refresh-token").post(refreshAccessToken);
// 5. change/update currunt password
router
  .route("/change-password")
  .post(
    verifyJWT,
    validate(changeCurrentPasswordSchema),
    changeCurrentPassword
  );
// 6. get currunt user profile
router.route("/current-user-profile").get(verifyJWT, getCurrentUserProfile);
// 7. update currunt user prrofile
router
  .route("/update-account-details")
  .patch(
    verifyJWT,
    validate(updateCurrentUserProfileSchema),
    updateCurrentUserProfile
  );
// 8. update currunt user avatar
router
  .route("/update-avatar")
  .patch(verifyJWT, upload.single("avatar"), updateCurruntUserAvatar);
// 9. update currunt user thumbnail
router
  .route("/update-cover-image")
  .patch(verifyJWT, upload.single("coverImage"), updateCurrentUserCoverImg);
// 10. get user channel profile by name
router
  .route("/c/:username")
  .get(
    verifyJWT,
    validate(getUserChannelProfileSchema, "params"),
    getUserChannelProfile
  );
// 11. get watch history of user
router.route("/watch-history").get(verifyJWT, getWatchHistory);

export default router;
