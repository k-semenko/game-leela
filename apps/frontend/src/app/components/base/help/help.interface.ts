import { UserProfileInterface } from '../../../interface';

export interface FeedbackReqInterface {
  email: string;
  user: number | null;
  subject: string;
  text: string;
}

export interface FeedbackInterface {
  id: number;
  email: string;
  user: UserProfileInterface | null;
  subject: string;
  text: string;
  comment: string;
  active: boolean;
  createdAt: string;
}

export interface UpdateFeedbackInterface {
  id: number;
  comment: string;
  active: boolean;
}
