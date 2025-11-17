"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface Notification {
  id: string;
  message: string;
  link?: string | null;
  createdAt: string;
}

const NotificationsBell = () => {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const fetchNotifications = async () => {
    if (!session) return;
    const res = await fetch("/api/notifications");
    if (res.ok) setNotifications(await res.json());
  };

  useEffect(() => {
    fetchNotifications();
    // Optional: Poll for new notifications every minute
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, [session]);

  const handleMarkAsRead = async () => {
    await fetch("/api/notifications", { method: "PUT" });
    setNotifications([]);
    setIsOpen(false);
  };

  if (!session) return null;

  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className="relative">
        <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg border z-10">
          <div className="p-4">
            <h3 className="font-semibold">Notifications</h3>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map(notif => (
                <Link key={notif.id} href={notif.link || "#"} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <p>{notif.message}</p>
                  <p className="text-xs text-gray-400">{new Date(notif.createdAt).toLocaleString()}</p>
                </Link>
              ))
            ) : (
              <p className="px-4 py-2 text-sm text-gray-500">No new notifications</p>
            )}
          </div>
          {notifications.length > 0 && (
            <div className="p-2 border-t">
              <button onClick={handleMarkAsRead} className="w-full text-sm text-center text-blue-600 hover:underline">
                Mark all as read
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationsBell;
