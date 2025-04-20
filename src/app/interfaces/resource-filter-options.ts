export enum OrderByOption {
	TitleAsc = 'TITLE_ASC',
	TitleDesc = 'TITLE_DESC',
	LikesDesc = 'LIKES_DESC',
	DownloadsDesc = 'DOWNLOADS_DESC',
	NewestFirst = 'NEWEST_FIRST',
}

export interface ResourceFilterOptions {
	topics?: string[]; // Array of topics
	subjects?: string[]; // Array of subjects
	grades?: string[]; // Array of grades
	orderBy?: OrderByOption; // OrderByOption enum
}
