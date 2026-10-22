import { Request, Response } from "express";
import * as service from "../service/blog.service";
import { Blog } from "../model/blog.model";
import { publicErrorMessage, publicErrorStatus } from "@/utils/publicError";

// ===== BLOG CONTROLLERS =====

export const createBlog = async (req: Request, res: Response) => {
  try {
    // Set author to current user
    req.body.author = req.userId;

    const blog = await service.createBlog(req.body);
    res.status(201).json({
      success: true,
      message: "Blog created successfully",
      data: blog,
    });
  } catch (error: any) {
    res.status(publicErrorStatus(error)).json({
      success: false,
      message: "Failed to create blog",
      error: publicErrorMessage(error),
    });
  }
};

export const getBlogById = async (req: Request, res: Response) => {
  try {
    // SECURITY: drafts and unapproved posts must not be readable by the
    // public. Only an admin/manager may see them.
    const canViewUnpublished =
      req.userRole === "admin" || req.userRole === "manager";
    const blog = await service.getBlogById(req.params.id, canViewUnpublished);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    res.json({
      success: true,
      message: "Blog retrieved successfully",
      data: blog,
    });
  } catch (error: any) {
    res.status(publicErrorStatus(error)).json({
      success: false,
      message: "Failed to retrieve blog",
      error: publicErrorMessage(error),
    });
  }
};

export const getBlogBySlug = async (req: Request, res: Response) => {
  try {
    const canViewUnpublished =
      req.userRole === "admin" || req.userRole === "manager";
    const blog = await service.getBlogBySlug(req.params.slug, canViewUnpublished);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    res.json({
      success: true,
      message: "Blog retrieved successfully",
      data: blog,
    });
  } catch (error: any) {
    res.status(publicErrorStatus(error)).json({
      success: false,
      message: "Failed to retrieve blog",
      error: publicErrorMessage(error),
    });
  }
};

export const getAllBlogs = async (req: Request, res: Response) => {
  try {
    const filters: any = { ...req.query };

    // SECURITY: `includeUnpublished` used to be passed straight through as a
    // truthy check, so the literal string "false" enabled it. Combined with
    // the route being public, `GET /api/blog?includeUnpublished=false`
    // returned every DRAFT and unapproved blog to anonymous callers.
    // It now has to be the exact string "true" AND the caller has to be an
    // admin or a manager.
    const wantsUnpublished = filters.includeUnpublished === "true";
    const isPrivileged = req.userRole === "admin" || req.userRole === "manager";

    if (!wantsUnpublished || !isPrivileged) {
      delete filters.includeUnpublished;
    }

    const result = await service.getAllBlogs(filters);

    res.json({
      success: true,
      message: "Blogs retrieved successfully",
      data: result.blogs,
      pagination: result.pagination,
    });
  } catch (error: any) {
    res.status(publicErrorStatus(error)).json({
      success: false,
      message: "Failed to retrieve blogs",
      error: publicErrorMessage(error),
    });
  }
};

export const updateBlog = async (req: Request, res: Response) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    // Check ownership.
    // SECURITY: this only fired for the "instructor" role, so a STUDENT
    // could update ANY blog - including publishing someone else's post.
    // Only an admin/manager may edit a post they do not own.
    const isStaff = req.userRole === "admin" || req.userRole === "manager";
    const isOwner =
      blog.author && String(blog.author) === String(req.userId);

    if (!isStaff && !isOwner) {
      return res.status(403).json({
        success: false,
        message: "You can only edit your own blogs",
      });
    }

    const updated = await service.updateBlog(req.params.id, req.body);

    res.json({
      success: true,
      message: "Blog updated successfully",
      data: updated,
    });
  } catch (error: any) {
    res.status(publicErrorStatus(error)).json({
      success: false,
      message: "Failed to update blog",
      error: publicErrorMessage(error),
    });
  }
};

export const deleteBlog = async (req: Request, res: Response) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    // Check ownership.
    // SECURITY: this only fired for the "instructor" role, so a STUDENT
    // could delete ANY blog.
    const isStaff = req.userRole === "admin" || req.userRole === "manager";
    const isOwner =
      blog.author && String(blog.author) === String(req.userId);

    if (!isStaff && !isOwner) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own blogs",
      });
    }

    await service.deleteBlog(req.params.id);

    res.json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error: any) {
    res.status(publicErrorStatus(error)).json({
      success: false,
      message: "Failed to delete blog",
      error: publicErrorMessage(error),
    });
  }
};

export const approveBlog = async (req: Request, res: Response) => {
  try {
    const blog = await service.approveBlog(req.params.id);

    res.json({
      success: true,
      message: "Blog approved successfully",
      data: blog,
    });
  } catch (error: any) {
    res.status(publicErrorStatus(error)).json({
      success: false,
      message: "Failed to approve blog",
      error: publicErrorMessage(error),
    });
  }
};

export const rejectBlog = async (req: Request, res: Response) => {
  try {
    const blog = await service.rejectBlog(req.params.id);

    res.json({
      success: true,
      message: "Blog rejected successfully",
      data: blog,
    });
  } catch (error: any) {
    res.status(publicErrorStatus(error)).json({
      success: false,
      message: "Failed to reject blog",
      error: publicErrorMessage(error),
    });
  }
};

export const getApprovalPendingBlogs = async (req: Request, res: Response) => {
  try {
    const blogs = await service.getApprovalPendingBlogs();

    res.json({
      success: true,
      message: "Pending approval blogs retrieved successfully",
      data: blogs,
    });
  } catch (error: any) {
    res.status(publicErrorStatus(error)).json({
      success: false,
      message: "Failed to retrieve pending blogs",
      error: publicErrorMessage(error),
    });
  }
};

// ===== CATEGORY CONTROLLERS =====

export const createCategory = async (req: Request, res: Response) => {
  try {
    const category = await service.createCategory(req.body);
    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error: any) {
    res.status(publicErrorStatus(error)).json({
      success: false,
      message: "Failed to create category",
      error: publicErrorMessage(error),
    });
  }
};

export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await service.getAllCategories();
    res.json({
      success: true,
      message: "Categories retrieved successfully",
      data: categories,
    });
  } catch (error: any) {
    res.status(publicErrorStatus(error)).json({
      success: false,
      message: "Failed to retrieve categories",
      error: publicErrorMessage(error),
    });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const category = await service.updateCategory(req.params.id, req.body);
    res.json({
      success: true,
      message: "Category updated successfully",
      data: category,
    });
  } catch (error: any) {
    res.status(publicErrorStatus(error)).json({
      success: false,
      message: "Failed to update category",
      error: publicErrorMessage(error),
    });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    await service.deleteCategory(req.params.id);
    res.json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error: any) {
    res.status(publicErrorStatus(error)).json({
      success: false,
      message: "Failed to delete category",
      error: publicErrorMessage(error),
    });
  }
};
