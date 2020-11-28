import { Router } from "express";

import authMiddleware from "./app/middlewares/authMiddleware";

import AuthController from "./app/controllers/AuthController";
import CountController from "./app/controllers/CountController";
import UserController from "./app/controllers/UserController";


const router = Router();

router.post('/users', UserController.store);
router.post('/auth', AuthController.authenticate);
router.post('/auth/refresh', AuthController.refresh);


router.post('/counts', authMiddleware, CountController.store);

router.get('/users', authMiddleware, UserController.index);
router.get('/counts', authMiddleware, CountController.index);


router.delete('/counts', authMiddleware, CountController.delete);


export default router;