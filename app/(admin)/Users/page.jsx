"use client";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function Users() {
  const { users, deleteUser, deleteUsers } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUserIds, setSelectedUserIds] = useState([]);

  const filteredUsers = users.filter(
    (user) =>
      (user.full_name || user.username || user.name || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (user.email || "").toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const toggleSelectAll = () => {
    const nonAdmins = filteredUsers.filter((u) => u.role !== "admin");
    if (selectedUserIds.length === nonAdmins.length && nonAdmins.length > 0) {
      setSelectedUserIds([]);
    } else {
      setSelectedUserIds(nonAdmins.map((u) => u.id));
    }
  };

  const toggleSelectUser = (id) => {
    setSelectedUserIds((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id],
    );
  };

  const handleBulkDelete = async () => {
    if (
      confirm(
        `Are you sure you want to delete ${selectedUserIds.length} users?`,
      )
    ) {
      const result = await deleteUsers(selectedUserIds);
      if (result.success) {
        setSelectedUserIds([]);
      } else {
        alert(
          "Error deleting users: " + (result.error?.message || result.message),
        );
      }
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    alert("ID Copied!");
  };

  return (
    <div className="p-8 min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <span className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </span>
            Users Management
          </h1>
          <p className="text-gray-500 mt-1">
            View and manage registered users.
          </p>
        </div>

        {selectedUserIds.length > 0 && (
          <button
            onClick={handleBulkDelete}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition shadow-md font-bold text-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            Delete Selected ({selectedUserIds.length})
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex items-center gap-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-gray-400"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
            clipRule="evenodd"
          />
        </svg>
        <input
          type="text"
          placeholder="Search by name or email..."
          className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="overflow-hidden shadow-md sm:rounded-xl border border-gray-100 bg-white">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50/50">
            <tr>
              <th scope="col" className="px-6 py-4 w-10">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
                  checked={
                    selectedUserIds.length > 0 &&
                    selectedUserIds.length ===
                      filteredUsers.filter((u) => u.role !== "admin").length
                  }
                  onChange={toggleSelectAll}
                />
              </th>
              <th scope="col" className="px-6 py-4">
                ID
              </th>
              <th scope="col" className="px-6 py-4">
                User
              </th>
              <th scope="col" className="px-6 py-4">
                Role
              </th>
              <th scope="col" className="px-6 py-4 text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => (
                <tr
                  key={`${user.id}-${index}`}
                  className={`border-b transition ${selectedUserIds.includes(user.id) ? "bg-indigo-50 hover:bg-indigo-100" : "bg-white hover:bg-gray-50"}`}
                >
                  <td className="px-6 py-4">
                    {user.role !== "admin" && (
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
                        checked={selectedUserIds.includes(user.id)}
                        onChange={() => toggleSelectUser(user.id)}
                      />
                    )}
                  </td>
                  <td className="px-6 py-4 font-mono text-gray-400 text-xs text-nowrap">
                    <div className="flex items-center gap-2">
                      <span title={user.id}>{user.id.substring(0, 8)}...</span>
                      <button
                        onClick={() => handleCopy(user.id)}
                        className="text-gray-400 hover:text-indigo-600 transition"
                        title="Copy ID"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3 text-nowrap">
                      <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg">
                        {(user.full_name || user.username || user.name || "U")
                          .charAt(0)
                          .toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          {user.full_name ||
                            user.username ||
                            user.name ||
                            "No Name"}
                        </div>
                        <div className="text-xs text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider ${user.role === "admin" ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-700"}`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {user.role !== "admin" && (
                      <button
                        onClick={async () => {
                          if (
                            confirm(
                              "Are you sure you want to delete this user?",
                            )
                          ) {
                            const result = await deleteUser(user.id);
                            if (!result.success) {
                              alert(
                                "Error deleting user: " +
                                  (result.error?.message || result.message),
                              );
                            }
                          }
                        }}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-full transition"
                        title="Delete User"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="px-6 py-12 text-center text-gray-400"
                >
                  <div className="flex flex-col items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12 mb-3 opacity-50"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                    <p>No users found matching "{searchTerm}"</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
