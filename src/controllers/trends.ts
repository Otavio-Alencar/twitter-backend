import { Response } from "express";
import { ExtendedRequest } from "../types/extended-request";
import { getAllTrends } from "../services/trend";

export const getTrends = async (req: ExtendedRequest, res: Response) => {
    const trends = await  getAllTrends()

    res.json({trends})
}