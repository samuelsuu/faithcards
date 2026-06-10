import { Alert, Pressable, ScrollView, Switch, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown } from "react-native-reanimated";
import { GradientBackground } from "@/components/ui/GradientBackground";
import { StatCard } from "@/components/StatCard";
import { useProfile } from "@/hooks/useProfile";
import { useAuthStore } from "@/stores/authStore";
import { usePreferencesStore } from "@/stores/preferencesStore";
import { useUpdateNotificationPrefs } from "@/hooks/useNotificationPrefs";
import { personaFromDbValue } from "@/constants/personality";
import { scheduleDailyReminder, cancelDailyReminder } from "@/lib/notifications";
import { colors, gradients, shadow } from "@/constants/theme";

export default function Profile() {
  const { data: profile } = useProfile();
  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);
  const updateNotifPrefs = useUpdateNotificationPrefs();

  const {
    darkMode,
    notificationsEnabled,
    reminderTime,
    setDarkMode,
    setNotificationsEnabled,
  } = usePreferencesStore();

  const persona = personaFromDbValue(profile?.personality_type);

  async function onToggleNotifications(value: boolean) {
    setNotificationsEnabled(value);
    if (value) {
      await scheduleDailyReminder(reminderTime);
    } else {
      await cancelDailyReminder();
    }
    updateNotifPrefs.mutate({ enabled: value });
  }

  function confirmLogout() {
    Alert.alert("Log out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Log out", style: "destructive", onPress: () => signOut() },
    ]);
  }

  return (
    <GradientBackground variant="morning">
      <SafeAreaView className="flex-1" edges={["top"]}>
        <ScrollView
          contentContainerClassName="px-6 pb-32 pt-2"
          showsVerticalScrollIndicator={false}
        >
          <Text className="text-3xl font-bold text-ink">Profile</Text>

          {/* Identity card */}
          <Animated.View entering={FadeInDown.duration(400)} className="mt-5">
            <View style={shadow} className="overflow-hidden rounded-4xl">
              <LinearGradient
                colors={gradients.card as unknown as [string, string]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="p-6"
              >
                <View className="flex-row items-center gap-4">
                  <View className="h-16 w-16 items-center justify-center rounded-full bg-white/20">
                    <Text className="text-2xl font-bold text-white">
                      {(profile?.full_name ?? "F").charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-xl font-bold text-white">
                      {profile?.full_name ?? "Friend"}
                    </Text>
                    <Text className="text-sm text-white/70">
                      {profile?.email ?? user?.email ?? ""}
                    </Text>
                  </View>
                </View>
                {persona ? (
                  <View className="mt-4 flex-row items-center gap-2 self-start rounded-full bg-white/15 px-3 py-1.5">
                    <Text>{persona.emoji}</Text>
                    <Text className="text-xs font-semibold text-white">
                      {persona.title}
                    </Text>
                  </View>
                ) : null}
              </LinearGradient>
            </View>
          </Animated.View>

          {/* Stats */}
          <Animated.View
            entering={FadeInDown.delay(100).duration(400)}
            className="mt-4 flex-row gap-3"
          >
            <StatCard
              icon="flame"
              tint={colors.amber}
              value={profile?.streak_count ?? 0}
              label="Day streak"
            />
            <StatCard
              icon="book"
              tint={colors.emerald}
              value={profile?.total_cards_viewed ?? 0}
              label="Cards viewed"
            />
            <StatCard
              icon="create"
              value={profile?.total_reflections ?? 0}
              label="Reflections"
            />
          </Animated.View>

          {/* Settings */}
          <Animated.View
            entering={FadeInDown.delay(200).duration(400)}
            className="mt-6"
          >
            <Text className="mb-2 ml-1 text-sm font-semibold text-ink-muted">
              Settings
            </Text>
            <View style={shadow} className="overflow-hidden rounded-3xl bg-surface">
              <SettingRow
                icon="notifications-outline"
                label="Daily reminder"
                right={
                  <Switch
                    value={notificationsEnabled}
                    onValueChange={onToggleNotifications}
                    trackColor={{ true: colors.brand[500], false: "#d1d5db" }}
                    thumbColor="#fff"
                  />
                }
              />
              <Divider />
              <SettingRow
                icon="moon-outline"
                label="Dark mode"
                right={
                  <Switch
                    value={darkMode}
                    onValueChange={setDarkMode}
                    trackColor={{ true: colors.brand[500], false: "#d1d5db" }}
                    thumbColor="#fff"
                  />
                }
              />
              <Divider />
              <SettingRow
                icon="time-outline"
                label="Reminder time"
                right={
                  <Text className="text-base font-medium text-ink-muted">
                    {reminderTime}
                  </Text>
                }
              />
            </View>
          </Animated.View>

          {/* Logout */}
          <Animated.View
            entering={FadeInDown.delay(300).duration(400)}
            className="mt-6"
          >
            <View style={shadow} className="overflow-hidden rounded-3xl bg-surface">
              <SettingRow
                icon="log-out-outline"
                label="Log out"
                tint={colors.rose}
                onPress={confirmLogout}
                right={
                  <Ionicons name="chevron-forward" size={20} color={colors.inkSoft} />
                }
              />
            </View>
          </Animated.View>

          <Text className="mt-8 text-center text-xs text-ink-soft">
            FaithCards • Daily Scripture for your soul
          </Text>
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
}

function SettingRow({
  icon,
  label,
  right,
  onPress,
  tint = colors.brand[500],
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  right?: React.ReactNode;
  onPress?: () => void;
  tint?: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      className="flex-row items-center justify-between px-5 py-4"
    >
      <View className="flex-row items-center gap-3">
        <View
          className="h-9 w-9 items-center justify-center rounded-full"
          style={{ backgroundColor: `${tint}1A` }}
        >
          <Ionicons name={icon} size={19} color={tint} />
        </View>
        <Text className="text-base font-medium text-ink">{label}</Text>
      </View>
      {right}
    </Pressable>
  );
}

function Divider() {
  return <View className="ml-16 h-px bg-line" />;
}
