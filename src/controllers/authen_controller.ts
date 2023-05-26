import { Request, Response } from "express";
import User from "../models/user";
import jwt from "jsonwebtoken";

class IndexController {
  async login(req: Request, res: Response) {
    try {
      let { email, password } = req.body;
      const user = await User.findOne({ email: email, password: password });
      console.log('user :',user);
      if (!user) {
        return res.status(404).json({ message: "Not found user" });
      }
      let token = await jwt.sign({ email, user_id: user._id }, "authen_signature");
      user.token = token;
      user.save();
      res.status(200).json({ token });
    } catch (err) {
      res.status(500).json({ message: "Err" });
    }
  }
  async logout(req: Request, res: Response) {
    try {
      let tokenstring: any = req.headers.authorization;
      console.log('req.headers', req.headers);
      let verifyObj: any = await jwt.verify(tokenstring, "authen_signature");
      if (!verifyObj) {
        return res.status(401).json({ message: "No Login" });
      }
      let user = await User.findById(verifyObj.user_id);
      if (!user || user.token != tokenstring) {
        return res.status(401).json({ message: "No Login" });
      }
      user.token = "";
      await user.save();
      res.status(200).json({ message: "Logout success" });
    } catch (err) {
      res.status(500).json({ message: "Err" });
    }
  }
}

export default new IndexController();
