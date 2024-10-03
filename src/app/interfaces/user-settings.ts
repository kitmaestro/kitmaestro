export interface UserSettings {
    _id: string;
    title: string,
    firstname: string,
    lastname: string,
    gender: string,
    phone: string,
    schoolName: string,
    district: string,
    regional: string,
    grades: string,
    subjects: string,
    photoURL: string,
    likedResources: string[];
    dislikedResources: string[];
    bookmarks: string[];
}
