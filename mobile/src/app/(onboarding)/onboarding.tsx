import { useRef, useState } from "react";
import {
  FlatList,
  StyleSheet,
  View,
  useWindowDimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { router } from "expo-router";

import Screen from "@/components/Screen";
import OnboardingCard from "@/components/OnboardingCard";
import Pagination from "@/components/Pagination";
import PrimaryButton from "@/components/PrimaryButton";
import SecondaryButton from "@/components/SecondaryButton";

import { ONBOARDING_DATA } from "@/data/onboarding";
import { SPACING } from "@/constants/spacing";
import { completeOnboarding } from "@/services/storage";

export default function OnboardingScreen() {
  const { width } = useWindowDimensions();

  const flatListRef = useRef<FlatList>(null);

  const [currentPage, setCurrentPage] = useState(0);

  const onScrollEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    const page = Math.round(
      event.nativeEvent.contentOffset.x / width
    );

    setCurrentPage(page);
  };

  const next = async () => {
    if (currentPage < ONBOARDING_DATA.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentPage + 1,
        animated: true,
      });

      return;
    }

    await completeOnboarding();

    router.replace("/(auth)/login");
  };

  const skip = async () => {
    await completeOnboarding();

    router.replace("/(auth)/login");
  };

  return (
    <Screen>
      <FlatList
        ref={flatListRef}
        data={ONBOARDING_DATA}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onMomentumScrollEnd={onScrollEnd}
        renderItem={({ item }) => (
          <View
            style={{
              width,
              flex: 1,
            }}
          >
            <OnboardingCard
              emoji={item.emoji}
              title={item.title}
              description={item.description}
            />
          </View>
        )}
      />

      <Pagination
        total={ONBOARDING_DATA.length}
        current={currentPage}
      />

      <View style={styles.buttons}>
        {currentPage !== ONBOARDING_DATA.length - 1 && (
          <SecondaryButton
            title="Skip"
            onPress={skip}
          />
        )}

        <PrimaryButton
          title={
            currentPage === ONBOARDING_DATA.length - 1
              ? "Get Started"
              : "Next"
          }
          onPress={next}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  buttons: {
    padding: SPACING.lg,
    gap: SPACING.md,
  },
});