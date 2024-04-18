import { getApiDefault } from "./api";

export async function getWeatherDetails(data) {
  const url = `data/2.5/weather?lat=${data?.lat}&lon=${data?.lon}&appid=${process.env.REACT_APP_API_KEY}&units=metric`;
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
  const url = `data/2.5/forecast?lat=${data?.lat}&lon=${data?.lon}&limit=5&appid=${process.env.REACT_APP_API_KEY}&units=metric&cnt=16`;
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
  const url = `geo/1.0/direct?q=${location}&appid=${process.env.REACT_APP_API_KEY}`;
  try {
    const res = await getApiDefault(url);
    if (res && res?.status === 200) {
      return res;
    }
  } catch (error) {
    return error;
  }
}
