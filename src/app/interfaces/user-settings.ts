export interface UserSettings {
    _id: string;
    title: string;
    firstname: string;
    lastname: string;
    username: string;
    email: string;
    gender: string;
    phone: string;
    schoolName: string;
    district: string;
    regional: string;
    refCode: string;
    photoURL: string;
    likedResources: string[];
    dislikedResources: string[];
    bookmarks: string[];
}
