import { Types } from 'mongoose';

export type TLiveClassStatus = 'scheduled' | 'ongoing' | 'completed' | 'cancelled';

export interface ILiveClass {
    title: string;
    courseId: Types.ObjectId;
    instructorId: Types.ObjectId;
    date: Date;
    duration: number; // in minutes
    platform: 'zoom' | 'meet';
    meetingLink: string;
    status: TLiveClassStatus;
}
