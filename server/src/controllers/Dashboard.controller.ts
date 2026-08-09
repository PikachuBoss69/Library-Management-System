import { Request, Response, NextFunction } from "express";
import * as dashboardService from '../services/dashboard.service';


export async function getStudentDashboard(req : Request, res : Response, next : NextFunction): Promise<void> {
    try{

        const userId = req.user!._id.toString();
        
        const dashboard =
        await dashboardService
        .getStudentDashboard(userId);
        
        res.status(200).json({
            status: "Success",
            message: "Data fetched Successfully",
            data: dashboard
        })
    }catch(error){
        next(error);
    }
}

export async function getLibrarianDashboard(req : Request, res : Response, next : NextFunction): Promise<void> {
    try{

        const userId = req.user!._id.toString();
        
        const dashboard =
        await dashboardService
        .getLibrarianDashboard(userId);
        
        res.status(200).json({
            status: "Success",
            message: "Data fetched Successfully",
            data: dashboard
        })
    }catch(error){
        next(error);
    }
}
export async function getAdminDashboard(req : Request, res : Response, next : NextFunction): Promise<void> {
    try{

        const userId = req.user!._id;
        
        const dashboard =
        await dashboardService
        .getAdminDashboard(userId);
        
        res.status(200).json({
            status: "Success",
            message: "Data fetched Successfully",
            data: dashboard
        })
    }catch(error){
        next(error);
    }
}
