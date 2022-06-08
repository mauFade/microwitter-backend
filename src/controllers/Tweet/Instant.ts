import { Request, Response } from "express";

import prisma from "../../services/prisma";

class TweetInstant {
  async create(request: Request, response: Response): Promise<any> {
    try {
      const { token }: { token: any } = Object(request["query"]);

      const id = token["userId"];

      const { text }: { text: string } = Object(request["body"]);

      // TODO: manipular data
      const tweet = await prisma.tweet.create({
        data: {
          userId: id,
          text,
          createdAt: new Date(),
        },
      });

      return response.status(200).send({ success: true, tweet });
    } catch (error) {
      return response.status(500).send(error);
    }
  }

  async read(request: Request, response: Response): Promise<any> {
    try {
      const tweets = await prisma.tweet.findMany({
        include: {
          user: true,
        },
      });

      return response.status(200).send({ success: true, tweets });
    } catch (error) {
      return response.status(500).send(error);
    }
  }

  async delete(request: Request, response: Response): Promise<any> {
    try {
      const { id }: { id: string } = Object(request["query"]);

      await prisma.tweet.delete({
        where: {
          id,
        },
      });

      return response.status(200).send({ success: true, message: "Tweet deleted successfully" });
    } catch (error) {
      return response.status(500).send(error);
    }
  }
}

export default new TweetInstant();
