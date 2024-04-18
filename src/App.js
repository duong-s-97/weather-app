import { useEffect, useState } from "react";
import "./App.css";
import "./assets/GlobalStyles/font-awesome-6.4.2-pro-main/css/all.css";
import { useMutation } from "@tanstack/react-query";
import {
  getLocation,
  getWeatherDetails,
  getWeatherForecast,
} from "./utils/callApi";
import { notify } from "./utils/common";

import { weatherIcons } from "./components/IconWeather";

function App() {
  const [inputValue, setInputValue] = useState("");
  const [description, setDescription] = useState("");
  const [iconCode, setIconCode] = useState("");
  const [dataLocation, setDataLocation] = useState({});
  const [dataWeatherDetail, setDataWeatherDetail] = useState({});
  const [timeZone, setTimeZone] = useState("25200");
  const [weatherList, setWeatherList] = useState({});

  useEffect(() => {
    mutationGetlocation("hanoi");
  }, []);

  const handleChangeInput = (event) => {
    setInputValue(event.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      mutationGetlocation(inputValue);
    }
  };

  const clearValueInput = () => {
    setInputValue("");
  };

  // call api
  const { mutate: mutationGetlocation } = useMutation({
    mutationFn: getLocation,
    onSuccess: (data) => {
      if ((data && data?.status === 200) || data?.status === "200") {
        const locationData = data?.data[0];
        setDataLocation(locationData);
        if (locationData) {
          const lat = Math.round(locationData?.lat * 100) / 100;
          const lon = Math.round(locationData?.lon * 100) / 100;
          const dataLocation = { lat: lat, lon: lon };
          mutationGetWeatherDetail(dataLocation);
          mutationGetWeatherForecast(dataLocation);
        }
      }
      return notify(data?.message, "error");
    },
  });

  const { mutate: mutationGetWeatherDetail } = useMutation({
    mutationFn: getWeatherDetails,
    onSuccess: (data) => {
      if ((data && data?.status === 200) || data?.status === "200") {
        setDataWeatherDetail(data?.data);
        setDescription(data?.data?.weather[0]?.description);
        setIconCode(data?.data?.weather[0]?.icon);
        setTimeZone(data?.data?.timezone);
      }
      return notify(data?.message, "error");
    },
  });

  const { mutate: mutationGetWeatherForecast } = useMutation({
    mutationFn: getWeatherForecast,
    onSuccess: (data) => {
      if ((data && data?.status === 200) || data?.status === "200") {
        const dataList = data?.data?.list;
        const listWeather = dataList.filter((item) => {
          // Lấy ngày tháng hiện tại và ngày tháng của mỗi đối tượng trong danh sách
          const currentDate = new Date();
          const itemDate = new Date(item.dt_txt);

          // Kiểm tra xem mốc thời gian của đối tượng có thuộc vào ngày tiếp theo hay không
          if (
            itemDate.getDate() === currentDate.getDate() + 1 &&
            [3, 6, 9, 12, 15].includes(itemDate.getHours())
          ) {
            return true;
          }
          return false;
        });

        setWeatherList(listWeather);
      }
      return notify(data?.message, "error");
    },
  });

  const currentTime = new Date(Date.now() + timeZone * 1000);

  const getFormattedDate = () => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const hours = ("0" + currentTime.getHours()).slice(-2);
    const minutes = ("0" + currentTime.getMinutes()).slice(-2);
    const weekday = days[currentTime.getDay()];
    const day = ("0" + currentTime.getDate()).slice(-2);
    const month = months[currentTime.getMonth()];
    const year = currentTime.getFullYear();

    return `${hours}:${minutes} - ${weekday}, ${day} ${month} ${year}`;
  };
  const formattedDate = getFormattedDate();

  const RENDR_ICON = (code) => {
    return (
      <img
        className="w-full min-w-16 max-w-24"
        src={weatherIcons[code]}
        alt=""
      />
    );
  };

  const RENDER_WEATHER_FORECAST = (item) => {
    return (
      <div key={item.dt} className="grid grid-cols-4 lg:mt-6">
        <div className="flex items-center text-4xl md:w-24 lg:text-5xl">
          {RENDR_ICON(item?.weather[0]?.icon)}
        </div>
        <div className="flex flex-col justify-center col-span-2 pl-5 text-left lg:text-xl">
          <p className="col-span-8">
            {item?.dt_txt.split("").slice(11, 16).join("")}
          </p>
          <p className="text-gray-100">{item?.weather[0]?.description}</p>
        </div>
        <div className="flex items-center justify-end col-span-1 text-xl text-right text-gray-100 lg:text-2xl">
          <p>{Math.round(item?.main?.temp)}°</p>
        </div>
      </div>
    );
  };
  return (
    <div className="relative grid w-screen h-screen grid-rows-5 overflow-hidden lg:grid-rows-1 lg:grid-cols-12 main-container">
      <div className="relative flex justify-center row-span-2 lg:col-span-8 md:row-span-3 main-section ">
        <div className="absolute flex items-center mx-auto text-white bottom-3">
          <div className="absolute flex border-b border-white right-5 -top-14 lg:hidden">
            <input
              placeholder="Search Location..."
              type="text"
              value={inputValue}
              onChange={handleChangeInput}
              onKeyDown={handleKeyPress}
              autoFocus
              className="mb-1 bg-transparent outline-none md:placeholder:text-lg placeholder:text-gray-100 md:w-52 md:text-2xl w-28 placeholder:text-white placeholder:text-xs"
            />
            <div>
              {inputValue ? (
                <button className="md:text-2xl" onClick={clearValueInput}>
                  <i className="fa-solid fa-xmark"></i>
                </button>
              ) : (
                <button className="md:text-2xl">
                  <i className="fa-solid fa-magnifying-glass"></i>
                </button>
              )}
            </div>
          </div>

          <div className="text-[4rem] flex md:text-[7.5rem]">
            {dataWeatherDetail
              ? Math.round(dataWeatherDetail?.main?.temp)
              : "No data"}
            <span className="-ml-1">°</span>
          </div>
          <div className="flex items-center justify-center md:ml-2">
            <div>
              <h1 className="text-3xl font-normal md:text-5xl">
                {dataLocation
                  ? dataLocation?.name + "," + dataLocation?.country
                  : "No data"}
              </h1>
              <p className="text-xs font-medium md:text-base">
                {formattedDate}
              </p>
            </div>
            <div className="self-end ml-3 text-4xl md:text-7xl md:ml-7">
              {iconCode ? RENDR_ICON(iconCode) : null}
            </div>
          </div>
        </div>
      </div>
      <div
        className="overflow-y-scroll custom-cursor lg:col-span-4 relative h-full border-blur-200 border-t-[5px] 
       lg:border-l-[5px] lg:border-t-0  row-span-3 bg-opacity-50 backdrop-blur-lg  bg-blur-100"
      >
        <div className="z-20 px-5 pt-10 pb-20 text-white lg:px-10 lg:flex lg:flex-col weather-bar">
          <div className="hidden border-b border-white lg:mb-14 lg:flex">
            <input
              placeholder="Search Location..."
              type="text"
              value={inputValue}
              onChange={handleChangeInput}
              onKeyDown={handleKeyPress}
              autoFocus
              className="mb-1 bg-transparent outline-none lg:text-xl lg:placeholder:text-xl lg:w-full w-28 placeholder:text-white placeholder:text-xs"
            />
            <div>
              {inputValue ? (
                <button onClick={clearValueInput}>
                  <i className="fa-solid fa-xmark"></i>
                </button>
              ) : (
                <button>
                  <i className="fa-solid fa-magnifying-glass"></i>
                </button>
              )}
            </div>
          </div>
          <div className="">
            <div className="mb-12 text-sm font-normal text-center lg:text-left lg:text-2xl">
              Weather Details
            </div>
            <div>
              <div className="font-medium text-center uppercase lg:text-left lg:text-2xl mb-7 ">
                {description ? description : "No data"}
              </div>
              <div className="pb-10 border-b border-white lg:text-2xl lg:grid lg:grid-rows-5 lg:gap-10">
                <div className="grid grid-cols-12 pb-5 lg:pb-0">
                  <p className="col-span-8">Temp max</p>
                  <div className="grid grid-cols-2 col-span-4 text-right">
                    <p className="flex">
                      {dataWeatherDetail
                        ? Math.round(dataWeatherDetail?.main?.temp_max)
                        : "No data"}
                      °
                    </p>
                    <div className="text-pink-100 ">
                      <i className="fa-regular fa-temperature-three-quarters"></i>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-12 pb-5 lg:pb-0">
                  <p className="col-span-8">Temp min</p>
                  <div className="grid grid-cols-2 col-span-4 text-right">
                    <p className="flex">
                      {dataWeatherDetail
                        ? Math.round(dataWeatherDetail?.main?.temp_min)
                        : "No data"}
                      °
                    </p>
                    <div className="text-blue-500 ">
                      <i className="fa-regular fa-temperature-three-quarters"></i>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-12 pb-5 lg:pb-0">
                  <p className="col-span-8">Humidity</p>
                  <div className="grid grid-cols-2 col-span-4 text-right">
                    <p className="flex">
                      {dataWeatherDetail
                        ? Math.round(dataWeatherDetail?.main?.humidity)
                        : "No data"}
                      %
                    </p>
                    <div className="">
                      <i className="fa-regular fa-droplet-percent"></i>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-12 pb-5 lg:pb-0">
                  <p className="col-span-8">Cloudy</p>
                  <div className="grid grid-cols-2 col-span-4 text-right ">
                    <p className="flex ">
                      {dataWeatherDetail
                        ? Math.round(dataWeatherDetail?.clouds?.all)
                        : "No data"}
                      %
                    </p>
                    <div className="">
                      <i className="fa-regular fa-clouds"></i>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-12 pb-5 lg:pb-0">
                  <p className="col-span-8">Wind</p>
                  <div className="grid grid-cols-2 col-span-4 text-right">
                    <p className="flex">
                      {dataWeatherDetail
                        ? Math.round(dataWeatherDetail?.wind?.speed)
                        : "No data"}
                      km/h
                    </p>
                    <div className="">
                      <i className="fa-regular fa-wind"></i>
                    </div>
                  </div>
                </div>
              </div>
              <div className="pt-12 pb-20">
                <div className="mb-16 text-sm font-normal text-center lg:text-left lg:text-2xl">
                  <h2>Weather Forecast</h2>
                </div>
                <div className="grid grid-flow-col grid-rows-5 gap-10">
                  {Object.keys(weatherList).length > 0
                    ? weatherList.map((item) => RENDER_WEATHER_FORECAST(item))
                    : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
