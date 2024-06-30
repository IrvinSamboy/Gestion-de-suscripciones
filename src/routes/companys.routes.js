import { Router } from "express";
import * as companyController from '../controllers/company.controller.js'
import checkAuth from "../midelwares/checkAuth.js";
const router = Router()

router.post('/create',checkAuth("admin"), companyController.createCompany)
router.put('/update/:idCompany',checkAuth("admin"), companyController.updateCompanys)

export default router