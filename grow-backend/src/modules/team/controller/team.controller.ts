import { Request, Response } from "express";
import teamService from "../service/team.service";
import { publicErrorMessage, publicErrorStatus } from "@/utils/publicError";

class TeamController {
    async getAllTeamMembers(req: Request, res: Response) {
        try {
            const result = await teamService.getAllTeamMembers();
            res.status(200).json(result);
        } catch (error) {
            res.status(publicErrorStatus(error as Error)).json({ success: false, message: publicErrorMessage(error as Error) });
        }
    }

    async getHomeTeamMembers(req: Request, res: Response) {
        try {
            const result = await teamService.getHomeTeamMembers();
            res.status(200).json(result);
        } catch (error) {
            res.status(publicErrorStatus(error as Error)).json({ success: false, message: publicErrorMessage(error as Error) });
        }
    }

    async getTeamMemberById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const result = await teamService.getTeamMemberById(id);
            if (!result.success) {
                res.status(404).json(result);
            } else {
                res.status(200).json(result);
            }
        } catch (error) {
            res.status(publicErrorStatus(error as Error)).json({ success: false, message: publicErrorMessage(error as Error) });
        }
    }

    async createTeamMember(req: Request, res: Response) {
        try {
            const { name, role, image, linkedIn, twitter, bio } = req.body;
            const result = await teamService.createTeamMember({
                name,
                role,
                image,
                linkedIn,
                twitter,
                bio,
            });
            if (!result.success) {
                res.status(400).json(result);
            } else {
                res.status(201).json(result);
            }
        } catch (error) {
            res.status(publicErrorStatus(error as Error)).json({ success: false, message: publicErrorMessage(error as Error) });
        }
    }

    async updateTeamMember(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const result = await teamService.updateTeamMember(id, req.body);
            if (!result.success) {
                res.status(404).json(result);
            } else {
                res.status(200).json(result);
            }
        } catch (error) {
            res.status(publicErrorStatus(error as Error)).json({ success: false, message: publicErrorMessage(error as Error) });
        }
    }

    async toggleShowHome(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { showOnHome } = req.body;
            const result = await teamService.toggleShowHome(id, showOnHome);
            if (!result.success) {
                res.status(404).json(result);
            } else {
                res.status(200).json(result);
            }
        } catch (error) {
            res.status(publicErrorStatus(error as Error)).json({ success: false, message: publicErrorMessage(error as Error) });
        }
    }

    async deleteTeamMember(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const result = await teamService.deleteTeamMember(id);
            if (!result.success) {
                res.status(404).json(result);
            } else {
                res.status(200).json(result);
            }
        } catch (error) {
            res.status(publicErrorStatus(error as Error)).json({ success: false, message: publicErrorMessage(error as Error) });
        }
    }

    async importInstructors(req: Request, res: Response) {
        try {
            const { instructorIds } = req.body;
            const result = await teamService.importInstructors(instructorIds);
            if (!result.success) {
                res.status(400).json(result);
            } else {
                res.status(201).json(result);
            }
        } catch (error) {
            res.status(publicErrorStatus(error as Error)).json({ success: false, message: publicErrorMessage(error as Error) });
        }
    }

    async getApprovedInstructors(req: Request, res: Response) {
        try {
            const result = await teamService.getApprovedInstructors();
            res.status(200).json(result);
        } catch (error) {
            res.status(publicErrorStatus(error as Error)).json({ success: false, message: publicErrorMessage(error as Error) });
        }
    }

    async reorderMembers(req: Request, res: Response) {
        try {
            const { memberOrders } = req.body;
            const result = await teamService.reorderMembers(memberOrders);
            res.status(200).json(result);
        } catch (error) {
            res.status(publicErrorStatus(error as Error)).json({ success: false, message: publicErrorMessage(error as Error) });
        }
    }

    async updateMemberPosition(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { position } = req.body;
            const result = await teamService.updateMemberPosition(id, position);
            if (!result.success) {
                res.status(404).json(result);
            } else {
                res.status(200).json(result);
            }
        } catch (error) {
            res.status(publicErrorStatus(error as Error)).json({ success: false, message: publicErrorMessage(error as Error) });
        }
    }
}

export default new TeamController();
