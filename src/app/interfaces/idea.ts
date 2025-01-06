export interface Idea {
    _id: string;
    user: string;
    title: string;
    description: string;
    votes: {
        user: string;
        like: boolean;
    }[];
}
