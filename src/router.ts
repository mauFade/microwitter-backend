import { Router } from "express";

import auth from "./services/authentication";

import AuthInstant from "./controllers/Authentication/Instant";
import UserInstant from "./controllers/User/Instant";
import TweetInstant from "./controllers/Tweet/Instant";

const router = Router();

router.post("/login", AuthInstant.create);

router.post("/user", UserInstant.create);
router.get("/user", auth.verifyJWT, UserInstant.read);
router.delete("/user", auth.verifyJWT, UserInstant.delete);

router.post("/tweet", auth.verifyJWT, TweetInstant.create);
router.get("/tweet", auth.verifyJWT, TweetInstant.read);
router.delete("/tweet", auth.verifyJWT, TweetInstant.delete);

export default router;
