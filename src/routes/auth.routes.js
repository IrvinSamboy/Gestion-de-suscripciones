import { Router } from "express";
import * as authController from '../controllers/auth.controller.js'
const router = Router()

router.post('/singUp', authController.singUp)
router.post('/singIn', authController.singIn)

export default router