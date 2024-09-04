export interface UserSubscription {
    id: string;
    uid: string;
    active: boolean;
    purchaseDate: Date;
    expiresAt: Date;
    method: string;
    referral: string;
    refCode: string;
    referries: string;
    refsCount: number;
    trial?: boolean;
    paidRef?: boolean;
}
