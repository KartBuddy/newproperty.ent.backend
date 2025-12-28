import {
  validateUserLogin,
  validateUserRegister,
} from "../../../utils/validator.js";
import { registerModel } from "../../../models/auth/register.model.js";
import { loginModel } from "../../../models/auth/login.model.js";
import { setJWTCookie } from "../../../utils/cookie.js";

class AuthController {
  static async register(req, res) {
    const validation = validateUserRegister.safeParse(req.body);

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
      const user = await registerModel(validation.data);

      return res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: user,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

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
      const user = await loginModel(validation.data);

       setJWTCookie(res, user);

      return res.status(200).json({
        success: true,
        message: "User logged in successfully",
        user: user,
      });
    } catch (error) {
      console.log(error);
      
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default AuthController;
