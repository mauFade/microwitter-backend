import { Request, Response } from "express";
import crypto from "crypto";

import prisma from "../../services/prisma";
import helper from "../../helpers/helper";

class UserInstant {
  async create(request: Request, response: Response): Promise<any> {
    try {
      const { name, email, username, password }: { name: string; email: string; username: string; password: string } =
        Object(request["body"]);

      if (!name || !email || !username || !password) {
        return response.status(403).send({ error: "All fields are required" });
      }

      const sameEmail = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      // Se já houver o mesmo email cadastrado
      if (sameEmail !== null) {
        return response.status(403).send({ error: "A user with this email already exists." });
      }

      const sameUsername = await prisma.user.findUnique({
        where: {
          username,
        },
      });

      if (sameUsername !== null) {
        return response.status(403).send({ error: "A user with this username already exists." });
      }

      const user = await prisma.user.create({
        data: {
          name,
          email,
          username,
          password,
        },
      });

      const hash = crypto.randomBytes(12).toString("hex");

      const userId = user["id"];

      // gera token
      const token = await helper.generateToken(userId, hash);

      return response.status(200).send({ success: true, data: { user, token } });
    } catch (error) {
      return response.status(500).send(error);
    }
  }

  async read(request: Request, response: Response): Promise<any> {
    try {
      const users = await prisma.user.findMany();

      return response.status(200).send({ success: true, users });
    } catch (error) {
      return response.status(500).send(error);
    }
  }

  async delete(request: Request, response: Response): Promise<any> {
    try {
      const { userId }: { userId: string } = Object(request["query"]);

      if (!userId) {
        return response.status(403).send({ error: "You must send an id." });
      }

      await prisma.user.delete({
        where: {
          id: userId,
        },
      });

      return response.status(200).send({ success: true, message: "User deleted successfully" });
    } catch (error) {
      return response.status(500).send(error);
    }
  }
}

export default new UserInstant();
