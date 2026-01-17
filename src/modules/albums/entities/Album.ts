export interface Album {
  id: string;
  title: string;
  description: string;
  photoCount: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}
