import { Router } from "express";
import * as pingController from "../controllers/ping"
export const mainrouter = Router()


mainrouter.get('/ping', pingController.ping)