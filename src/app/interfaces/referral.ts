export interface Referral {
  _id: string;
  referrer: string;
  referred: string;
  date: Date;
  status: string;
}
