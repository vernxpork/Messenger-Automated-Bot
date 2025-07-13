const axios = require('axios');

module.exports.config = {
  name: "weather",
  version: "1.0.0",
  role: 0,
  credits: "vern",
  description: "Get the current weather info for a city.",
  usage: "/weather <city>",
  prefix: true,
  cooldowns: 3,
  commandCategory: "Utility"
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  const city = args.join(' ').trim();
  const prefix = "/"; // Change if your bot uses a dynamic prefix

  // If city is not provided
  if (!city) {
    const usageMessage = 
      `════『 𝗪𝗘𝗔𝗧𝗛𝗘𝗥 』════\n\n` +
      `⚠️ Oops! Please provide a city name to check the weather.\n\n` +
      `📌 Usage: ${prefix}weather <city>\n` +
      `💬 Example: ${prefix}weather Cebu\n\n` +
      `> Thank you for keeping up with the weather!`;

    return api.sendMessage(usageMessage, threadID, messageID);
  }

  try {
    // Friendly loading message
    const waitMsg = 
      `════『 𝗪𝗘𝗔𝗧𝗛𝗘𝗥 』════\n\n` +
      `🌦️ Looking up the sky over "${city}"... Please wait just a moment!`;
    await api.sendMessage(waitMsg, threadID, messageID);

    // Fetch weather from API
    const apiUrl = "https://kaiz-apis.gleeze.com/api/weather";
    const response = await axios.get(apiUrl, {
      params: {
        q: city,
        apikey: "4fe7e522-70b7-420b-a746-d7a23db49ee5"
      },
      timeout: 10000
    });

    const data = response.data;
    let resultMsg = `════『 𝗪𝗘𝗔𝗧𝗛𝗘𝗥 』════\n\n`;

    if (data && data.name) {
      // Humanized greetings
      const intros = [
        `🌤️ Here's the weather for ${data.name}${data.sys?.country ? `, ${data.sys.country}` : ''}:`,
        `☀️ Weather update for ${data.name}:`,
        `🌦️ Curious about the sky in ${data.name}? Let's check:`,
        `🌈 Weather in ${data.name} at a glance:`
      ];
      const intro = intros[Math.floor(Math.random() * intros.length)];
      resultMsg += `${intro}\n\n`;

      // Weather summary with emoji for feels
      if (data.weather && data.weather[0]) {
        resultMsg += `• Condition: ${data.weather[0].main} (${data.weather[0].description})\n`;
      }
      if (typeof data.main?.temp !== "undefined") {
        resultMsg += `• Temperature: ${data.main.temp}°C\n`;
      }
      if (typeof data.main?.feels_like !== "undefined") {
        resultMsg += `• Feels like: ${data.main.feels_like}°C\n`;
      }
      if (typeof data.main?.humidity !== "undefined") {
        resultMsg += `• Humidity: ${data.main.humidity}%\n`;
      }
      if (typeof data.main?.pressure !== "undefined") {
        resultMsg += `• Pressure: ${data.main.pressure} hPa\n`;
      }
      if (typeof data.wind?.speed !== "undefined") {
        resultMsg += `• Wind: ${data.wind.speed} m/s\n`;
      }
      if (typeof data.visibility !== "undefined") {
        resultMsg += `• Visibility: ${(data.visibility / 1000).toFixed(1)} km\n`;
      }
      if (typeof data.clouds?.all !== "undefined") {
        resultMsg += `• Cloudiness: ${data.clouds.all}%\n`;
      }
      if (typeof data.main?.temp_min !== "undefined" && typeof data.main?.temp_max !== "undefined") {
        resultMsg += `• Low/High: ${data.main.temp_min}°C/${data.main.temp_max}°C\n`;
      }

      resultMsg += `\n> ☔ Stay safe, bring an umbrella if needed, and have a wonderful day!\n> Powered by Kaiz APIs`;
    } else if (data?.message) {
      resultMsg += `⚠️ ${data.message}`;
    } else {
      resultMsg += "⚠️ Sorry, I couldn't find weather info for that city. Please check the spelling or try another location!";
    }

    return api.sendMessage(resultMsg, threadID, messageID);

  } catch (error) {
    console.error('❌ Error in weather command:', error && error.response && error.response.data ? error.response.data : error.message || error);

    let errMsg = "Unknown error";
    if (error.response && error.response.data && error.response.data.message) {
      errMsg = error.response.data.message;
    } else if (error.message) {
      errMsg = error.message;
    }

    const errorMessage = 
      `════『 𝗪𝗘𝗔𝗧𝗛𝗘𝗥 𝗘𝗥𝗥𝗢𝗥 』════\n\n` +
      `🚫 Failed to fetch the weather info.\nReason: ${errMsg}\n\n` +
      `> Please try again in a bit.`;

    return api.sendMessage(errorMessage, threadID, messageID);
  }
};