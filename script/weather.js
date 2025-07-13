const axios = require('axios');

module.exports.config = {
  name: "weather",
  version: "1.1.0",
  role: 0,
  credits: "vern",
  description: "Get the current weather using OpenWeatherMap.",
  usage: "/weather <city>",
  prefix: false,
  cooldowns: 5,
  commandCategory: "utility"
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID } = event;
  const city = args.join(" ").trim();
  const prefix = "/"; // Replace this if using a dynamic prefix
  const apiKey = "f4c4bb0896f91549fc530d12feceb8f7"; // <<== Paste your API key here

  if (!city) {
    return api.sendMessage(
      `☁️ Please provide a city name.\n\n` +
      `Usage: ${prefix}weather <city>\nExample: ${prefix}weather Manila`,
      threadID
    );
  }

  try {
    // Loading message
    await api.sendMessage(`☁️ Fetching weather for "${city}"...`, threadID);

    const response = await axios.get("https://api.openweathermap.org/data/2.5/weather", {
      params: {
        q: city,
        appid: apiKey,
        units: "metric"
      },
      timeout: 10000
    });

    const data = response.data;

    const introLines = [
      `🌤️ Here's the weather for ${data.name}, ${data.sys.country}:`,
      `☀️ Weather report for ${data.name}:`,
      `🌦️ What's the sky like in ${data.name}?`,
      `🌈 Weather at a glance for ${data.name}:`
    ];

    const intro = introLines[Math.floor(Math.random() * introLines.length)];

    const resultMsg = 
      `════『 𝗪𝗘𝗔𝗧𝗛𝗘𝗥 𝗨𝗣𝗗𝗔𝗧𝗘 』════\n\n` +
      `${intro}\n\n` +
      `• Condition: ${data.weather[0].main} (${data.weather[0].description})\n` +
      `• Temperature: ${data.main.temp}°C\n` +
      `• Feels Like: ${data.main.feels_like}°C\n` +
      `• Humidity: ${data.main.humidity}%\n` +
      `• Wind Speed: ${data.wind.speed} m/s\n` +
      `• Visibility: ${(data.visibility / 1000).toFixed(1)} km\n` +
      `• Pressure: ${data.main.pressure} hPa\n` +
      `• Min/Max: ${data.main.temp_min}°C / ${data.main.temp_max}°C\n\n` +
      `> Stay dry, stay safe 🌂`;

    return api.sendMessage(resultMsg, threadID);
    
  } catch (err) {
    const errorMsg = err.response?.data?.message || err.message || "Unknown error";
    return api.sendMessage(
      `🚫 Unable to fetch weather for "${city}".\nReason: ${errorMsg}`,
      threadID
    );
  }
};