"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SiteContent = void 0;
const mongoose_1 = require("mongoose");
const siteContentSchema = new mongoose_1.Schema({
    page: {
        type: String,
        required: true,
        unique: true,
    },
    content: {
        type: Map,
        of: mongoose_1.Schema.Types.Mixed,
        required: true,
    },
}, {
    timestamps: true,
});
exports.SiteContent = (0, mongoose_1.model)('SiteContent', siteContentSchema);
