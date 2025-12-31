import { validateUserLogin } from "../../../utils/validator.js";
import LoginModel from "../../../models/auth/login.model.js";
import User from "../../../models/auth/user.model.js";
import { setJWTAuthCookie, clearJWTAuthCookie } from "../../../utils/cookie.js";

class AuthController {
  static async login(req, res) {
    const validation = validateUserLogin.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        errors: validation.error.errors.map((e) => ({
          field: e.path[0],
          message: e.message,
        })),
      });
    }

    try {
      const { email, password } = validation.data;
      const user = await LoginModel.login(email, password);

      setJWTAuthCookie(res, user);

      return res.status(200).json({
        success: true,
        message: "User logged in successfully",
        user,
      });
    } catch (error) {
      console.log(error);

      return res.status(401).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async logout(req, res) {
    try {
      clearJWTAuthCookie(res);
      return res.status(200).json({
        success: true,
        message: "User logged out successfully",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to logout",
        error: error.message,
      });
    }
  }

  static async updateProfile(req, res) {
    try {
      const { name, email } = req.body;
      const userId = req.user.id;

      const user = await User.updateProfile(userId, { name, email });
      return res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        user,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to update profile",
        error: error.message,
      });
    }
  }

  static async updatePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user.id;

      const user = await User.findById(userId);
      if (user.password !== currentPassword) {
        return res.status(400).json({
          success: false,
          message: "Current password is incorrect",
        });
      }

      await User.updatePassword(userId, newPassword);
      return res.status(200).json({
        success: true,
        message: "Password updated successfully",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to update password",
        error: error.message,
      });
    }
  }
}

export default AuthController;
