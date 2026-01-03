// This file has intentionally bad formatting
interface User {
  id: number;
  name: string;
}

export const createUser = (name: string): User => {
  return { id: 1, name };
};

export const getUsers = (): User[] => {
  return [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
  ];
};
