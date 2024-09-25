export interface UserSubscription {
  _id: string;
  user: string;
  subscriptionType: string;
  status: string;
  startDate: Date;
  endDate: Date;
  method: string;
  amount: number;
}
