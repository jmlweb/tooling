import { useState } from 'react';

type User = {
  id: number;
  name: string;
  email: string;
};

const initialUsers: User[] = [
  { id: 1, name: 'Alice', email: 'alice@example.com' },
  { id: 2, name: 'Bob', email: 'bob@example.com' },
];

function App(): React.JSX.Element {
  const [users] = useState<User[]>(initialUsers);

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="mx-auto max-w-4xl px-4">
        <h1 className="mb-8 text-4xl font-bold text-gray-900">
          React TypeScript App Example
        </h1>

        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-2xl font-semibold text-gray-800">Users</h2>
          <ul className="space-y-2">
            {users.map((user) => (
              <li
                key={user.id}
                className="rounded border border-gray-200 bg-gray-50 p-4"
              >
                <div className="font-medium text-gray-900">{user.name}</div>
                <div className="text-sm text-gray-600">{user.email}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export { App };
