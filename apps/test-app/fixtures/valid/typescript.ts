type User = {
  id: number;
  name: string;
  email: string;
};

export const createUser = (name: string, email: string): User => {
  return {
    id: Math.floor(Math.random() * 1000),
    name,
    email,
  };
};

export const getUsers = (): User[] => {
  return [
    { id: 1, name: 'Alice', email: 'alice@example.com' },
    { id: 2, name: 'Bob', email: 'bob@example.com' },
  ];
};

export const findUserById = (users: User[], id: number): User | undefined => {
  return users.find((user) => user.id === id);
};
