import { UserSettings } from './user-settings';

export interface Idea {
    _id: string;
    user: UserSettings;
    title: string;
    description: string;
    votes: {
        user: string;
        like: boolean;
    }[];
}
