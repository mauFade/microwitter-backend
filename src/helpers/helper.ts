import jwt from "jsonwebtoken";

import key from "../config/auth.json";

class helper {
  async generateToken(userId: string, hash: string): Promise<string> {
    return jwt.sign({ userId, hash }, key.secret, {
      // Expira em 5h
      expiresIn: 18000,
    });
  }
}

export default new helper();
