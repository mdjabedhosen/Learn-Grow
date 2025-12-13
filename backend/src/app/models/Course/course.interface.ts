import { Types } from 'mongoose';

export type TLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface ILesson {
    title: string;
    type: 'video' | 'pdf' | 'quiz';
    contentUrl: string;
    duration?: number; // in seconds
    isFreePreview?: boolean;
}

export interface IModule {
    title: string;
    orderIndex: number;
    lessons: ILesson[];
}

export interface ICourse {
    title: string;
    description: string;
    category: string;
    price: number;
    thumbnail: string;
    level: TLevel;
    instructorId: Types.ObjectId;
    modules: IModule[];
    isPublished: boolean;
    totalDuration: number; // calculated
    totalStudents: number;
    rating: number;
}
