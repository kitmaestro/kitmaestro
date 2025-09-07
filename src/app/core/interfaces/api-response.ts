export interface ApiCreationResponse {}

export interface ApiDeleteResponse {
	acknowledged: boolean;
	deletedCount: number;
}

export interface ApiErrorResponse {
	message: string;
	error?: string;
	statusCode?: number;
}

export interface ApiUpdateResponse {
	acknowledged: boolean;
	modifiedCount: number;
	upsertedId: string | null;
	upsertedCount: number;
	matchedCount: number;
}
