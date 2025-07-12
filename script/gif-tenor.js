const axios = require("axios");

module.exports.config = {
  name: 'gif-tenor',
  aliases: ["tenor", "animegif", "gifsearch", "tenorgif"],
  description: 'Search and send anime GIFs from Tenor via Kaiz-API.',
  version: '1.0.0',
  role: 0,
  cooldown: 3,
  credits: "Kaizenji | Converted by Vern",
  hasPrefix: false,
  usage: "gif-tenor [keyword] [limit]",
  dependencies: {
    "axios": ""
  }
};

module.exports.run = async function({ api, event, args }) {
  const { threadID, messageID } = event;
  let search = args[0] ? args.join(" ") : "Anime";
  let limit = 10;

  // If user provides a number at the end, use it as limit
  if (args.length > 1 && !isNaN(args[args.length - 1])) {
    limit = Math.min(Math.max(parseInt(args.pop()), 1), 20); // limit between 1-20
    search = args.join(" ") || "Anime";
  }

  const apikey = "c8374909-9674-41c2-9b96-1d3b68adb4af";
  const url = `https://kaiz-apis.gleeze.com/api/gif-tenor?search=${encodeURIComponent(search)}&limit=${limit}&apikey=${apikey}`;

  try {
    const res = await axios.get(url);
    const data = res.data;
    if (!data.imageurls || data.imageurls.length === 0) {
      api.sendMessage(`No GIFs found for "${search}".`, threadID, messageID);
      return;
    }

    const gifList = data.imageurls.map((gif, i) => `${i + 1}. ${gif}`).join("\n");
    const msg = `𝗚𝗶𝗳 𝗦𝗲𝗮𝗿𝗰𝗵: ${search}\n𝗧𝗼𝘁𝗮𝗹: ${data.gif_length}\n\n${gifList}\n\nPowered by Kaizenji`;

    api.sendMessage(msg, threadID, messageID);
  } catch (err) {
    console.error(err);
    api.sendMessage("Error fetching GIFs. Please try again later.", threadID, messageID);
  }
};