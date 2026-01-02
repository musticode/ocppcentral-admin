import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Check, X, Trash2 } from "lucide-react";
import { cn } from "@/utils/cn";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "error" | "success";
  timestamp: string;
  read: boolean;
}

// Dummy notifications data
const dummyNotifications: Notification[] = [
  {
    id: "1",
    title: "Charger Offline",
    message: "Charger ID 844832345689 connector 2 is offline",
    type: "error",
    timestamp: "2024/01/15 10:30:00",
    read: false,
  },
  {
    id: "2",
    title: "Transaction Completed",
    message: "Transaction 4555687 completed successfully",
    type: "success",
    timestamp: "2024/01/15 09:15:00",
    read: false,
  },
  {
    id: "3",
    title: "Low Battery Warning",
    message: "Charger ID 844832345690 battery level is below 20%",
    type: "warning",
    timestamp: "2024/01/15 08:45:00",
    read: true,
  },
  {
    id: "4",
    title: "New User Registered",
    message: "User John Doe has been registered",
    type: "info",
    timestamp: "2024/01/14 16:20:00",
    read: true,
  },
  {
    id: "5",
    title: "Maintenance Scheduled",
    message: "Maintenance scheduled for Charger ID 844832345691 on 2024/01/20",
    type: "info",
    timestamp: "2024/01/14 14:10:00",
    read: false,
  },
];

const typeColors = {
  info: "bg-blue-100 text-blue-800",
  warning: "bg-yellow-100 text-yellow-800",
  error: "bg-red-100 text-red-800",
  success: "bg-green-100 text-green-800",
};

export const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>(dummyNotifications);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications =
    filter === "unread"
      ? notifications.filter((n) => !n.read)
      : notifications;

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const deleteAllRead = () => {
    setNotifications(notifications.filter((n) => !n.read));
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="mt-1 text-sm text-gray-600">
            {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={markAllAsRead}>
            Mark all as read
          </Button>
          <Button variant="outline" size="sm" onClick={deleteAllRead}>
            <Trash2 className="mr-2 h-4 w-4" />
            Clear read
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("all")}
        >
          All ({notifications.length})
        </Button>
        <Button
          variant={filter === "unread" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("unread")}
        >
          Unread ({unreadCount})
        </Button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Bell className="h-12 w-12 text-gray-400" />
              <p className="mt-4 text-sm text-gray-500">No notifications</p>
            </CardContent>
          </Card>
        ) : (
          filteredNotifications.map((notification) => (
            <Card
              key={notification.id}
              className={cn(
                "transition-colors",
                !notification.read && "border-l-4 border-l-primary bg-gray-50"
              )}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">
                        {notification.title}
                      </h3>
                      <Badge
                        variant="outline"
                        className={typeColors[notification.type]}
                      >
                        {notification.type}
                      </Badge>
                      {!notification.read && (
                        <div className="h-2 w-2 rounded-full bg-primary" />
                      )}
                    </div>
                    <p className="mt-1 text-sm text-gray-600">
                      {notification.message}
                    </p>
                    <p className="mt-2 text-xs text-gray-500">
                      {notification.timestamp}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {!notification.read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => markAsRead(notification.id)}
                        className="h-8 w-8 p-0"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteNotification(notification.id)}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

