"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SiteContentRoutes = void 0;
const express_1 = __importDefault(require("express"));
const siteContent_controller_1 = require("./siteContent.controller");
const Auth_1 = __importDefault(require("../../middlewares/Auth"));
const router = express_1.default.Router();
// Get content (Public)
router.get('/:page', siteContent_controller_1.SiteContentControllers.getContent);
// Update content (Admin only)
router.post('/', (0, Auth_1.default)('admin', 'superAdmin'), siteContent_controller_1.SiteContentControllers.updateContent);
exports.SiteContentRoutes = router;
