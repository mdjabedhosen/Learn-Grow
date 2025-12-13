import { Schema, model } from 'mongoose';
import { TSiteContent } from './siteContent.interface';

const siteContentSchema = new Schema<TSiteContent>(
    {
        page: {
            type: String,
            required: true,
            unique: true,
        },
        content: {
            type: Map,
            of: Schema.Types.Mixed,
            required: true,
        },
    },
    {
        timestamps: true,
    },
);

export const SiteContent = model<TSiteContent>('SiteContent', siteContentSchema);
