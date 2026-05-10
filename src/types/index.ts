export type User = {
  id: string | number | undefined;
  _id: string | number | undefined;
  username: string;
  name: string;
  bio: string;
  image: string;
};

export type Thread = {
  id: string | number | undefined;
  text: string;
  author: User;
  community: string | null;
  createdAt: Date;
  updatedAt?: Date;
  children?: Thread[];
  parentId?: string;
};
