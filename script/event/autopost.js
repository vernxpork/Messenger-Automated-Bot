module.exports.config = {
    name: "autopostcatfact",
    version: "1.0.0",
};

let isPosting = false;
let intervalStarted = false;

module.exports.handleEvent = async function ({ api }) {
    // Start the interval only once to prevent multiple timers
    if (intervalStarted) return;
    intervalStarted = true;

    const postCatFact = async () => {
        if (isPosting) return;
        isPosting = true;
        try {
            const axios = require('axios');
            // Fetch a cat fact from the API
            const response = await axios.get("https://kaiz-apis.gleeze.com/api/catfact?apikey=4fe7e522-70b7-420b-a746-d7a23db49ee5");
            const catFact = response.data?.result || "Here's a fun cat fact for you!";

            // Humanize: add some playful intro
            const greetings = [
                "🐾 Did you know?",
                "😺 Cat Fact:",
                "Here's something purr-fectly interesting:",
                "Time for a feline fun fact!",
                "Paws up! Fact incoming:",
                "😻 Fun Cat Fact:"
            ];
            const greeting = greetings[Math.floor(Math.random() * greetings.length)];

            // Compose the message
            const message = `════『 𝗔𝗨𝗧𝗢 𝗖𝗔𝗧 𝗙𝗔𝗖𝗧 』════\n\n${greeting}\n${catFact}\n\n> Stay pawsitive and share the feline fun! 🐈`;

            // Post the message
            await api.createPost({
                body: message,
                visibility: "Everyone"
            });
        } catch (error) {
            console.error('Error posting cat fact:', error);
        } finally {
            isPosting = false;
        }
    };

    // Schedule every 10 minutes (600,000 ms)
    setInterval(() => {
        postCatFact();
    }, 10 * 60 * 1000);

    // Trigger immediately on startup
    postCatFact();
};