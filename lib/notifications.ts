import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const DAILY_CHANNEL = "faithcards-daily";

export async function requestNotificationPermissions(): Promise<boolean> {
  if (!Device.isDevice) return false;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync(DAILY_CHANNEL, {
      name: "Daily reminder",
      importance: Notifications.AndroidImportance.DEFAULT,
      lightColor: "#6366F1",
    });
  }

  const { status: existing } = await Notifications.getPermissionsAsync();
  let status = existing;
  if (existing !== "granted") {
    const req = await Notifications.requestPermissionsAsync();
    status = req.status;
  }
  return status === "granted";
}

/**
 * Schedule (or reschedule) the daily "your cards are ready" reminder.
 * `time` is "HH:mm". Clears previously scheduled FaithCards reminders first.
 */
export async function scheduleDailyReminder(time = "07:30"): Promise<void> {
  const granted = await requestNotificationPermissions();
  if (!granted) return;

  await Notifications.cancelAllScheduledNotificationsAsync();

  const [hour, minute] = time.split(":").map((n) => parseInt(n, 10));

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "FaithCards 🕊️",
      body: "Your FaithCards are ready for today.",
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: Number.isFinite(hour) ? hour : 7,
      minute: Number.isFinite(minute) ? minute : 30,
      channelId: DAILY_CHANNEL,
    },
  });
}

export async function cancelDailyReminder(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
