import { Request, Response } from "express";
import crypto from "crypto";

import prisma from "../../services/prisma";
import helper from "../../helpers/helper";

class AuthInstant {
  async create(request: Request, response: Response): Promise<any> {
    try {
      const { email, password }: { email: string; password: string } = Object(request["body"]);

      if (!email || !password) {
        return response.status(403).send({ error: "All fields are required." });
      }

      const user = await prisma.user.findFirst({
        where: {
          email,
        },
      });

      if (!user) {
        return response.status(404).send({ error: "No user found with this email." });
      }

      if (user["password"] !== password) {
        return response.status(403).send({ error: "Invalid password." });
      }

      const hash = crypto.randomBytes(12).toString("hex");

      const userId = user["id"];

      // gera token
      const token = await helper.generateToken(userId, hash);

      return response.status(200).send({ success: true, data: { user, token } });
    } catch (error) {
      return response.status(500).send(error);
    }
  }
}

export default new AuthInstant();
