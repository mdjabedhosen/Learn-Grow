import { Request, Response } from "express";
import roleService from "../service/role.service";
import { publicErrorMessage, publicErrorStatus } from "@/utils/publicError";

class RoleController {
    async getAllRoles(req: Request, res: Response) {
        try {
            const result = await roleService.getAllRoles();
            res.status(200).json(result);
        } catch (error) {
            res.status(publicErrorStatus(error as Error)).json({ success: false, message: publicErrorMessage(error as Error) });
        }
    }

    async getRoleById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const result = await roleService.getRoleById(id);
            if (!result.success) {
                res.status(404).json(result);
            } else {
                res.status(200).json(result);
            }
        } catch (error) {
            res.status(publicErrorStatus(error as Error)).json({ success: false, message: publicErrorMessage(error as Error) });
        }
    }

    async createRole(req: Request, res: Response) {
        try {
            const { name } = req.body;
            const result = await roleService.createRole({ name });
            if (!result.success) {
                res.status(400).json(result);
            } else {
                res.status(201).json(result);
            }
        } catch (error) {
            res.status(publicErrorStatus(error as Error)).json({ success: false, message: publicErrorMessage(error as Error) });
        }
    }

    async updateRole(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const result = await roleService.updateRole(id, req.body);
            if (!result.success) {
                res.status(404).json(result);
            } else {
                res.status(200).json(result);
            }
        } catch (error) {
            res.status(publicErrorStatus(error as Error)).json({ success: false, message: publicErrorMessage(error as Error) });
        }
    }

    async reorderRoles(req: Request, res: Response) {
        try {
            const { roleOrders } = req.body;
            const result = await roleService.reorderRoles(roleOrders);
            res.status(200).json(result);
        } catch (error) {
            res.status(publicErrorStatus(error as Error)).json({ success: false, message: publicErrorMessage(error as Error) });
        }
    }

    async deleteRole(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const result = await roleService.deleteRole(id);
            if (!result.success) {
                res.status(400).json(result);
            } else {
                res.status(200).json(result);
            }
        } catch (error) {
            res.status(publicErrorStatus(error as Error)).json({ success: false, message: publicErrorMessage(error as Error) });
        }
    }

    async seedDefaultRoles(req: Request, res: Response) {
        try {
            const result = await roleService.seedDefaultRoles();
            res.status(200).json(result);
        } catch (error) {
            res.status(publicErrorStatus(error as Error)).json({ success: false, message: publicErrorMessage(error as Error) });
        }
    }
}

export default new RoleController();
