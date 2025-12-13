import { ILiveClass } from './liveClass.interface';
import { LiveClass } from './liveClass.model';

const scheduleClass = async (payload: ILiveClass) => {
    const result = await LiveClass.create(payload);
    return result;
};

const getClasses = async (query: Record<string, unknown>) => {
    const result = await LiveClass.find(query)
        .populate('courseId', 'title')
        .populate('instructorId', 'student_name');
    return result;
};

const getMyClasses = async (userId: string, role: string) => {
    let query = {};
    if (role === 'instructor') {
        query = { instructorId: userId };
    }
    // For students, we need to find enrolled courses first (Implemented in next steps)

    const result = await LiveClass.find(query)
        .populate('courseId', 'title')
        .sort({ date: 1 });
    return result;
};

const updateClassStatus = async (id: string, status: string) => {
    const result = await LiveClass.findByIdAndUpdate(id, { status }, { new: true });
    return result;
};

const deleteClass = async (id: string) => {
    const result = await LiveClass.findByIdAndDelete(id);
    return result;
};

export const LiveClassServices = {
    scheduleClass,
    getClasses,
    getMyClasses,
    updateClassStatus,
    deleteClass,
};
