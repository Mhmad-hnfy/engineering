"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function VideoStats() {
  const [stats, setStats] = useState({ totalViews: 0, views: [] });

  useEffect(() => {
    fetch("/api/video/view")
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8 text-gray-900">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Video Analytics</h1>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Views
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalViews}</div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="font-semibold">Recent Views Log</h2>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="p-4">Time</th>
              <th className="p-4">Video ID</th>
              <th className="p-4">User</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {stats.views.map((view, i) => (
              <tr key={i}>
                <td className="p-4">
                  {new Date(view.watchedAt).toLocaleString()}
                </td>
                <td className="p-4 font-mono">{view.videoId}</td>
                <td className="p-4">{view.userId}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {stats.views.length === 0 && (
          <p className="p-8 text-center text-gray-500">
            No views recorded yet.
          </p>
        )}
      </div>
    </div>
  );
}
