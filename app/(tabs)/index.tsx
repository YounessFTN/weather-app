import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";

import { HelloWave } from "@/components/hello-wave";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import * as Location from "expo-location";

export default function HomeScreen() {
  const [localisationUser, setLocalisationUser] = useState({});
  const [weatherData, setWeatherData] = useState<any>({});

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        console.log("Permission refusée");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setLocalisationUser(location.coords);
    })();
  }, []);

  let lat = localisationUser.latitude;
  let lon = localisationUser.longitude;
  let API_KEY = process.env.EXPO_PUBLIC_KEY_OPENWEATHER;
  let part = "hourly,daily";

  const urlApi =
    "https://api.openweathermap.org/data/2.5/weather?lat=" +
    lat +
    "&lon=" +
    lon +
    "&exclude=" +
    part +
    "&appid=" +
    API_KEY;

  function fetchData() {
    fetch(urlApi)
      .then((response) => response.json())
      .then((data) => {
        setWeatherData(data);
      })
      .catch((error) => {
        console.error("Error fetching weather data:", error);
      });
  }
  fetchData();
  console.log(weatherData);
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">
          {weatherData?.name ?? "Chargement..."}
        </ThemedText>
        <ThemedText type="defaultSemiBold">
          {weatherData?.main?.temp
            ? `${Math.round(weatherData.main.temp - 273.15)} °C`
            : "--"}
        </ThemedText>
        <ThemedText>{weatherData?.weather?.[0]?.description ?? ""}</ThemedText>
        <ThemedText>
          {weatherData?.main?.humidity
            ? `Humidité : ${weatherData.main.humidity} %`
            : ""}
        </ThemedText>
        <ThemedText>
          {weatherData?.wind?.speed
            ? `Vent : ${weatherData.wind.speed} m/s`
            : ""}
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
