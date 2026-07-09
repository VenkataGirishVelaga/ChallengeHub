import AsyncStorage from "@react-native-async-storage/async-storage";

export async function setItem(
  key: string,
  value: string
) {
  await AsyncStorage.setItem(key, value);
}

export async function getItem(key: string) {
  return AsyncStorage.getItem(key);
}

export async function removeItem(key: string) {
  await AsyncStorage.removeItem(key);
}

export async function multiRemove(keys: string[]) {
  await AsyncStorage.multiRemove(keys);
}

export async function setJSON<T>(
  key: string,
  value: T
) {
  await setItem(key, JSON.stringify(value));
}

export async function getJSON<T>(key: string) {
  const value = await getItem(key);

  return value ? (JSON.parse(value) as T) : null;
}