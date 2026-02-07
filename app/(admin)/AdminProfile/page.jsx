"use client";
import React, { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { Button } from "@/components/ui/button";
import { User, Mail, Lock, Check, AlertCircle } from "lucide-react";

export default function AdminProfile() {
  const { currentUser, updateUserProfile } = useAuth();
  const [formData, setFormData] = useState({
    username: currentUser?.username || currentUser?.name || "",
    email: currentUser?.email || "",
    newPassword: "",
  });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isSaving, setIsSaving] = useState(false);

  // Sync formData if currentUser changes (e.g., after initial load or remote update)
  React.useEffect(() => {
    if (currentUser && !isSaving) {
      setFormData((prev) => ({
        ...prev,
        username: currentUser.username || currentUser.name || "",
        email: currentUser.email || "",
      }));
    }
  }, [currentUser, isSaving]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", message: "" });
    setIsSaving(true);

    try {
      const updateData = {
        username: formData.username,
      };

      // Only include email if it actually changed to avoid unnecessary triggers
      if (formData.email !== currentUser.email) {
        updateData.email = formData.email;
      }

      if (formData.newPassword) {
        if (formData.newPassword.length < 6) {
          throw new Error("Password must be at least 6 characters long.");
        }
        updateData.password = formData.newPassword;
      }

      const result = await updateUserProfile(updateData);

      if (result.success) {
        let successMsg = "Profile updated successfully!";
        if (updateData.email) {
          successMsg =
            "Profile updated! Please check your new email to confirm the change.";
        }
        setStatus({ type: "success", message: successMsg });
        setFormData((prev) => ({ ...prev, newPassword: "" }));
      } else {
        setStatus({
          type: "error",
          message:
            result.message ||
            "Failed to update profile. Please check your data.",
        });
      }
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    } finally {
      setIsSaving(false);
    }
  };

  if (!currentUser)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Profile</h1>
        <p className="text-gray-500 mt-2">
          Manage your administrative account settings.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
            <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mb-4 border-4 border-white shadow-sm">
              <User className="w-12 h-12 text-indigo-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">
              {currentUser.username || currentUser.name}
            </h2>
            <p className="text-sm text-gray-500">{currentUser.email}</p>
            <div className="mt-4 px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full uppercase tracking-wider">
              System Admin
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="lg:col-span-2">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6"
          >
            {status.message && (
              <div
                className={`p-4 rounded-xl flex items-center gap-3 ${status.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
              >
                {status.type === "success" ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <AlertCircle className="w-5 h-5" />
                )}
                <p className="font-medium">{status.message}</p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Display Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                    placeholder="Enter admin name"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                    placeholder="admin@example.com"
                    required
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-50">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                    placeholder="Leave blank to keep current password"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  Make sure it's at least 6 characters for better security.
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                disabled={isSaving}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-6 rounded-xl font-bold text-lg shadow-lg shadow-indigo-600/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSaving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
