const axios = require("axios");

module.exports.config = {
  name: 'gif-tenor',
  aliases: ["tenor", "animegif", "gifsearch", "tenorgif", "videogif"],
  description: 'Search and list anime video GIFs (MP4) from Tenor via Kaiz-API.',
  version: '1.1.0',
  role: 0,
  cooldown: 3,
  credits: "Kaizenji | Adapted by Vern",
  hasPrefix: false,
  usage: "gif-tenor [keyword] [limit]",
  dependencies: {
    "axios": ""
  }
};

// Helper to convert Tenor .gif to .mp4
function gifToMp4(url) {
  if (url.endsWith('.gif')) {
    return url.replace('.gif', '.mp4');
  }
  return url;
}

module.exports.run = async function({ api, event, args }) {
  const { threadID, messageID } = event;
  let search = args[0] ? args.join(" ") : "Anime";
  let limit = 10;

  // If last arg is a number, use as limit
  if (args.length > 1 && !isNaN(args[args.length - 1])) {
    limit = Math.min(Math.max(parseInt(args.pop()), 1), 20);
    search = args.join(" ") || "Anime";
  }

  const apikey = "c8374909-9674-41c2-9b96-1d3b68adb4af";
  const url = `https://kaiz-apis.gleeze.com/api/gif-tenor?search=${encodeURIComponent(search)}&limit=${limit}&apikey=${apikey}`;

  try {
    const res = await axios.get(url);
    const data = res.data;
    if (!data.imageurls || data.imageurls.length === 0) {
      api.sendMessage(`No video GIFs found for "${search}".`, threadID, messageID);
      return;
    }

    // Convert GIF URLs to MP4
    const videoUrls = data.imageurls.map(gifToMp4);

    const videoList = videoUrls.map((vid, i) => `${i + 1}. ${vid}`).join("\n");
    const msg = `𝗩𝗶𝗱𝗲𝗼 𝗚𝗶𝗳 𝗦𝗲𝗮𝗿𝗰𝗵: ${search}\n𝗧𝗼𝘁𝗮𝗹: ${data.gif_length}\n\n${videoList}\n\nPowered by Kaizenji`;

    api.sendMessage(msg, threadID, messageID);
  } catch (err) {
    console.error(err);
    api.sendMessage("Error fetching video GIFs. Please try again later.", threadID, messageID);
  }
};