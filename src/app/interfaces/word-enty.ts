export interface WordEntry {
    id: number;
    word: string;
    synonyms: string[];
    antonyms: string[];
    level: 1 | 2 | 3 | 4 | 5;
    categories: string[];
}
