export enum OrderByOption {
	TitleAsc = 'TITLE_ASC',
	TitleDesc = 'TITLE_DESC',
	LikesDesc = 'LIKES_DESC',
	DownloadsDesc = 'DOWNLOADS_DESC',
	NewestFirst = 'NEWEST_FIRST',
}

export interface ResourceFilterOptions {
	topics?: string[];
	subjects?: string[];
	grades?: string[];
	orderBy?: OrderByOption;
}
