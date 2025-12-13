import { SiteContent } from './siteContent.model';
import { TSiteContent } from './siteContent.interface';

const createOrUpdateContent = async (payload: TSiteContent) => {
    const result = await SiteContent.findOneAndUpdate(
        { page: payload.page },
        { content: payload.content },
        { new: true, upsert: true, runValidators: true },
    );
    return result;
};

const getContent = async (page: string) => {
    const result = await SiteContent.findOne({ page });
    return result;
};

export const SiteContentServices = {
    createOrUpdateContent,
    getContent,
};
