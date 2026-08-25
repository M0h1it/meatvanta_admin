import { useEffect, useState, useCallback, useRef } from "react";
import {
  fetchNotifications,
  fetchUnreadCount,
  markNotificationRead,
  markAllNotificationsRead,
} from "../features/notifications/api/notificationsApi";
import { usePermission } from "./usePermission";
import { playNotificationSound } from "../lib/notificationSound";

const POLL_INTERVAL_MS = 30000; // 30s - plenty for a shop doing tens of orders a day

/**
 * Polls the unread count and rings a chime when it goes up.
 * Polling rather than websockets is a deliberate trade: real-time infra isn't
 * worth the complexity at this volume, and a 30s delay is invisible in practice.
 */
export function useNotifications() {
  const { hasPermission } = usePermission();
  const canView = hasPermission("notifications:view");

  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Tracks the previous count so we only chime on an *increase*, not every poll.
  // Deliberately compared outside the setState updater - React StrictMode
  // double-invokes updaters in dev, which made the sound fire unreliably.
  const previousCountRef = useRef(null);

  const refreshCount = useCallback(async () => {
    if (!canView) return;
    try {
      const count = await fetchUnreadCount();

      const previous = previousCountRef.current;
      previousCountRef.current = count;

      // previous === null means this is the first poll after load - don't chime
      // for notifications that were already sitting there.
      if (previous !== null && count > previous) {
        playNotificationSound();
      }

      setUnreadCount(count);
    } catch {
      // Silent - a failed poll shouldn't throw errors at someone mid-task.
    }
  }, [canView]);

  const loadNotifications = useCallback(async () => {
    if (!canView) return;
    setIsLoading(true);
    try {
      const data = await fetchNotifications({ limit: 15 });
      setNotifications(data);
    } catch {
      setNotifications([]);
    } finally {
      setIsLoading(false);
    }
  }, [canView]);

  const markRead = useCallback(
    async (id) => {
      try {
        await markNotificationRead(id);
        setNotifications((current) =>
          current.map((n) => (n.id === id ? { ...n, isRead: true } : n))
        );
        refreshCount();
      } catch {
        // no-op
      }
    },
    [refreshCount]
  );

  const markAllRead = useCallback(async () => {
    try {
      await markAllNotificationsRead();
      setNotifications((current) => current.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
      previousCountRef.current = 0;
    } catch {
      // no-op
    }
  }, []);

  useEffect(() => {
    if (!canView) return;
    refreshCount();
    const interval = setInterval(refreshCount, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [canView, refreshCount]);

  return { unreadCount, notifications, isLoading, loadNotifications, markRead, markAllRead, canView };
}
