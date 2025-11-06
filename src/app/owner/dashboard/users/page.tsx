"use client";

import React, { useState } from "react";
import { useUsers, User, UserUpdate } from "./hooks/useUsers";
import UsersTable from "./UsersTable";
import UserModal from "./UserModal";
import NewUserModal from "./NewUserModal";
import api from "@/utils/api";

interface NewUser {
  name: string;
  email: string;
  role: "owner" | "vendor";
  vendorId?: number;
  password: string;
}

export default function UsersPage() {
  const { users, loading, error, updateUser, fetchUsers } = useUsers();

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [newUserModalOpen, setNewUserModalOpen] = useState(false);

  // Edit existing user
  const handleEdit = (user: User): void => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  const handleModalClose = (): void => {
    setSelectedUser(null);
    setModalOpen(false);
  };

  // Save updates for existing user
  const handleSave = async (id: string, updates: Partial<UserUpdate>): Promise<void> => {
    try {
      await updateUser(id, updates);
      setModalOpen(false);
    } catch {
      // Handle error if needed
    }
  };

  // New User form state
  const [newUser, setNewUser] = useState<NewUser>({
    name: "",
    email: "",
    role: "vendor",
    vendorId: undefined,
    password: "",
  });
  const [newUserError, setNewUserError] = useState<string | null>(null);
  const [newUserLoading, setNewUserLoading] = useState(false);

  // Open New User Modal
  const openNewUserModal = () => {
    setNewUser({
      name: "",
      email: "",
      role: "vendor",
      vendorId: undefined,
      password: "",
    });
    setNewUserError(null);
    setNewUserModalOpen(true);
  };

  const closeNewUserModal = () => {
    setNewUserModalOpen(false);
    setNewUserError(null);
  };

  // Handle input changes in NewUserModal
  const handleNewUserChange = (field: string, value: string | number | undefined) => {
    setNewUser((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Create new user API call
  const handleCreateUser = async () => {
  setNewUserLoading(true);
  setNewUserError(null);

  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Unauthorized");

    const res = await api.post(
      "/api/auth/register",
      newUser,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res.status !== 201) {
      throw new Error(res.data.message || "Failed to create user");
    }

    await fetchUsers();
    setNewUserModalOpen(false);
  } catch (err: unknown) {
    if (err instanceof Error) {
      setNewUserError(err.message);
    } else {
      setNewUserError("Failed to create user");
    }
  } finally {
    setNewUserLoading(false);
  }
};

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Users</h1>
        <button
          onClick={openNewUserModal}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          Add User
        </button>
      </div>

      {loading && <p>Loading users...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <UsersTable users={users} onEdit={handleEdit} />

      {modalOpen && selectedUser && (
        <UserModal user={selectedUser} onClose={handleModalClose} onSave={handleSave} />
      )}

      {newUserModalOpen && (
        <NewUserModal
          user={newUser}
          onClose={closeNewUserModal}
          onChange={handleNewUserChange}
          onSave={handleCreateUser}
          loading={newUserLoading}
          error={newUserError}
        />
      )}
    </div>
  );
}
