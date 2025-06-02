import { getAllUsers } from "@/lib/actions/getAllUsers";
import { User } from "better-auth";
import React, { useEffect, useState } from "react";

const UsersList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      const users = await getAllUsers();
      setUsers(users);
      setIsLoading(false);
    };
    fetchUsers();
  }, []);

  return isLoading ? (
    <div className="flex flex-col gap-2 w-full max-w-[400px] px-2">
      <div className="border rounded p-2 animate-pulse flex flex-col gap-4">
        <div className="h-4 w-1/2 bg-neutral-700 rounded"></div>
        <div className="h-4 w-1/3 bg-neutral-700 rounded"></div>
      </div>
    </div>
  ) : (
    <div className="flex flex-col gap-2 w-full max-w-[400px] px-2">
      {users.map((user, index) => (
        <div key={index} className="border rounded p-2">
          <p>{user.name}</p>
          <p>{user.email}</p>
        </div>
      ))}
    </div>
  );
};

export default UsersList;
