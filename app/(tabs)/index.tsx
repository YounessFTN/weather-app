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
      <ThemedView style={styles.weatherCard}>
        <ThemedText style={styles.weatherCity}>
          {weatherData?.name ?? "Chargement..."}
        </ThemedText>
        <ThemedText style={styles.weatherTemp}>
          {weatherData?.main?.temp
            ? `${Math.round(weatherData.main.temp - 273.15)}°`
            : "--"}
        </ThemedText>
        <ThemedText style={styles.weatherDesc}>
          {weatherData?.weather?.[0]?.description ?? ""}
        </ThemedText>
        <ThemedView style={styles.weatherDetails}>
          <ThemedView style={styles.weatherDetailItem}>
            <ThemedText style={styles.weatherDetailIcon}>💧</ThemedText>
            <ThemedText style={styles.weatherDetailValue}>
              {weatherData?.main?.humidity
                ? `${weatherData.main.humidity} %`
                : "--"}
            </ThemedText>
            <ThemedText style={styles.weatherDetailLabel}>Humidité</ThemedText>
          </ThemedView>
          <ThemedView style={styles.weatherSeparator} />
          <ThemedView style={styles.weatherDetailItem}>
            <ThemedText style={styles.weatherDetailIcon}>🌬️</ThemedText>
            <ThemedText style={styles.weatherDetailValue}>
              {weatherData?.wind?.speed
                ? `${weatherData.wind.speed} m/s`
                : "--"}
            </ThemedText>
            <ThemedText style={styles.weatherDetailLabel}>Vent</ThemedText>
          </ThemedView>
        </ThemedView>
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
  weatherCard: {
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    gap: 4,
    marginBottom: 16,
    backgroundColor: "rgba(161, 206, 220, 0.2)",
    borderWidth: 1,
    borderColor: "rgba(161, 206, 220, 0.4)",
  },
  weatherCity: {
    fontSize: 18,
    letterSpacing: 2,
    textTransform: "uppercase",
    opacity: 0.7,
  },
  weatherTemp: {
    fontSize: 80,
    fontWeight: "200",
    lineHeight: 90,
  },
  weatherDesc: {
    fontSize: 16,
    textTransform: "capitalize",
    opacity: 0.8,
    marginBottom: 12,
  },
  weatherDetails: {
    flexDirection: "row",
    alignItems: "center",
    gap: 24,
    marginTop: 8,
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  weatherDetailItem: {
    alignItems: "center",
    gap: 2,
  },
  weatherDetailIcon: {
    fontSize: 22,
  },
  weatherDetailValue: {
    fontSize: 15,
    fontWeight: "600",
  },
  weatherDetailLabel: {
    fontSize: 11,
    opacity: 0.6,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  weatherSeparator: {
    width: 1,
    height: 40,
    backgroundColor: "rgba(161, 206, 220, 0.5)",
  },
});
