import { useMemo, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeIn, FadeOut, LinearTransition } from "react-native-reanimated";
import { GradientBackground } from "@/components/ui/GradientBackground";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Loader } from "@/components/ui/Loader";
import { EmptyState } from "@/components/ui/EmptyState";
import { IconButton } from "@/components/ui/IconButton";
import {
  useReflections,
  useUpdateReflection,
  useDeleteReflection,
} from "@/hooks/useReflections";
import { formatDate } from "@/lib/utils";
import { colors, shadow } from "@/constants/theme";
import type { Reflection } from "@/types";

export default function Journal() {
  const { data, isLoading } = useReflections();
  const deleteReflection = useDeleteReflection();
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<Reflection | null>(null);

  const reflections = useMemo(() => data ?? [], [data]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return reflections;
    return reflections.filter(
      (r) =>
        r.note.toLowerCase().includes(q) ||
        r.scriptures?.reference.toLowerCase().includes(q) ||
        r.scriptures?.text.toLowerCase().includes(q),
    );
  }, [reflections, query]);

  return (
    <GradientBackground variant="morning">
      <SafeAreaView className="flex-1" edges={["top"]}>
        <View className="px-6 pb-3 pt-2">
          <Text className="text-3xl font-bold text-ink">Journal</Text>
          <Text className="text-sm text-ink-muted">
            What God has been saying to you
          </Text>
        </View>

        <View className="px-6 pb-2">
          <Input
            icon="search-outline"
            placeholder="Search reflections"
            value={query}
            onChangeText={setQuery}
            autoCapitalize="none"
          />
        </View>

        {isLoading ? (
          <Loader label="Loading journal…" />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon="book-outline"
            title={reflections.length === 0 ? "No reflections yet" : "No matches"}
            subtitle={
              reflections.length === 0
                ? "After reading a card, write what God is saying to you."
                : "Try a different search."
            }
          />
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(r) => r.id}
            contentContainerClassName="px-6 pb-32 gap-3 pt-1"
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <ReflectionRow
                reflection={item}
                onEdit={() => setEditing(item)}
                onDelete={() => deleteReflection.mutate(item.id)}
              />
            )}
          />
        )}
      </SafeAreaView>

      <EditModal reflection={editing} onClose={() => setEditing(null)} />
    </GradientBackground>
  );
}

function ReflectionRow({
  reflection,
  onEdit,
  onDelete,
}: {
  reflection: Reflection;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const s = reflection.scriptures;
  return (
    <Animated.View
      entering={FadeIn}
      exiting={FadeOut}
      layout={LinearTransition.springify()}
      style={shadow}
      className="rounded-3xl bg-surface p-5"
    >
      <View className="flex-row items-center justify-between">
        <Text className="text-xs font-medium text-ink-soft">
          {formatDate(reflection.created_at)}
        </Text>
        <View className="flex-row gap-1">
          <IconButton
            icon="create-outline"
            surface={false}
            size={19}
            color={colors.brand[500]}
            onPress={onEdit}
            accessibilityLabel="Edit reflection"
          />
          <IconButton
            icon="trash-outline"
            surface={false}
            size={19}
            color={colors.rose}
            onPress={onDelete}
            accessibilityLabel="Delete reflection"
          />
        </View>
      </View>

      {s ? (
        <View className="mt-1 rounded-2xl bg-brand-500/10 p-3">
          <Text className="text-sm font-semibold text-brand-700">
            {s.reference}
          </Text>
          <Text className="mt-0.5 text-xs italic text-ink-muted" numberOfLines={2}>
            {s.text}
          </Text>
        </View>
      ) : null}

      <Text className="mt-3 text-base leading-6 text-ink">{reflection.note}</Text>
    </Animated.View>
  );
}

function EditModal({
  reflection,
  onClose,
}: {
  reflection: Reflection | null;
  onClose: () => void;
}) {
  const update = useUpdateReflection();
  const [note, setNote] = useState("");
  const open = !!reflection;

  function save() {
    if (!reflection) return;
    update.mutate(
      { id: reflection.id, note: note.trim() || reflection.note },
      { onSuccess: onClose },
    );
  }

  return (
    <Modal
      visible={open}
      transparent
      animationType="slide"
      onShow={() => setNote(reflection?.note ?? "")}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1 justify-end bg-black/40"
      >
        <Pressable className="flex-1" onPress={onClose} />
        <View className="rounded-t-4xl bg-surface p-6 pb-10">
          <View className="mb-4 h-1.5 w-12 self-center rounded-full bg-brand-100" />
          <Text className="mb-1 text-xl font-bold text-ink">Edit reflection</Text>
          {reflection?.scriptures ? (
            <Text className="mb-3 text-sm text-ink-muted">
              {reflection.scriptures.reference}
            </Text>
          ) : null}
          <TextInput
            className="min-h-[120px] rounded-2xl border border-line bg-surface-soft p-4 text-base text-ink"
            placeholder="Write your reflection…"
            placeholderTextColor={colors.inkSoft}
            multiline
            textAlignVertical="top"
            value={note}
            onChangeText={setNote}
            autoFocus
          />
          <View className="mt-4 flex-row gap-3">
            <View className="flex-1">
              <Button label="Cancel" variant="secondary" onPress={onClose} />
            </View>
            <View className="flex-1">
              <Button label="Save" loading={update.isPending} onPress={save} />
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
