export interface ApiUpdateResponse {
    acknowledged: boolean,
    modifiedCount: number,
    upsertedId: string | null,
    upsertedCount: number,
    matchedCount: number
}