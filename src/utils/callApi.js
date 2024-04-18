import { getApiDefault } from "./api";

export async function getWeatherDetails(data) {
  const url = `data/2.5/weather?lat=${data?.lat}&lon=${data?.lon}&appid=725868c3aaf1274a6d419daf418a58b8yarn&units=metric`;
  try {
    const res = await getApiDefault(url);
    if (res && res?.status === 200) {
      return res;
    }
  } catch (error) {
    return error;
  }
}

export async function getWeatherForecast(data) {
  const url = `data/2.5/forecast?lat=${data?.lat}&lon=${data?.lon}&limit=5&appid=725868c3aaf1274a6d419daf418a58b8yarn&units=metric&cnt=16`;
  try {
    const res = await getApiDefault(url);
    if (res && res?.status === 200) {
      return res;
    }
  } catch (error) {
    return error;
  }
}

export async function getLocation(location) {
  const url = `geo/1.0/direct?q=${location}&appid=725868c3aaf1274a6d419daf418a58b8yarn`;
  try {
    const res = await getApiDefault(url);
    if (res && res?.status === 200) {
      return res;
    }
  } catch (error) {
    return error;
  }
}
