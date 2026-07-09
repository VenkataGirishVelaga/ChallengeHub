import { useEffect, useState } from "react";
import { FlatList } from "react-native";

import Screen from "@/components/Screen";
import ChallengeCard from "../../components/challenges/ChallengeCard";

import { getChallenges } from "@/services/challenges";

export default function ChallengesScreen() {
  const [challenges, setChallenges] = useState([]);

  useEffect(() => {
    async function load() {
      const data = await getChallenges();
      setChallenges(data);
    }

    load();
  }, []);

  return (
    <Screen>
      <FlatList
        data={challenges}
        keyExtractor={(item: any) => item.id.toString()}
        renderItem={({ item }) => (
          <ChallengeCard challenge={item} />
        )}
      />
    </Screen>
  );
}