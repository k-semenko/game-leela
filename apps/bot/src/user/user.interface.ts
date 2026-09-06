export interface UserInterface {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  firstName?: string;
  lastName?: string;
  tg?: {
    telegramId: number;
  };
}

export enum UserRole {
  User = 'USER',
  Curator = 'CURATOR',
  Admin = 'ADMIN',
}
