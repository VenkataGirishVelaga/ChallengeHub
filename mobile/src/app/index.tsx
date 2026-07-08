import { Redirect } from "expo-router";

export default function Index() {
  // Cast to any to satisfy the Redirect href type when route types are not inferred
  return <Redirect href={"/welcome" as any} />;
}