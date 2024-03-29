export interface UserSubscription {
    id: string;
    uid: string;
    active: boolean;
    purchaseDate: Date;
    expiresAt: Date;
    method: string;
    refCode: string;
    referries: string;
    refsCount: number;
}