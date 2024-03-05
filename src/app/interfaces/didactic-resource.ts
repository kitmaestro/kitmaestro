export enum ResourceType {
    Free = "FREE",
    Paid = "PAID"
}

export interface DidacticResource {
    id: string;
    title: string;
    description: string;
    format: string;
    grade: string;
    level: string;
    subject: string;
    topic: string;
    downloadLink: string;
    preview: string;
    author: string;
    type: ResourceType;
    price?: number;
    likes: number;
    dislikes: number;
    downloads: number;
    bookmarks: number;
    categories: string[]; // Categories like topics, subjects, grades, etc.
}
