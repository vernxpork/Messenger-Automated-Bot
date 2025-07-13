module.exports.config = {
    name: "autopostcatfact",
    version: "1.0.0",
};

let isPosting = false;
let intervalStarted = false;

module.exports.handleEvent = async function ({ api }) {
    if (intervalStarted) return;
    intervalStarted = true;

    const postCatFact = async () => {
        if (isPosting) return;
        isPosting = true;
        try {
            const axios = require('axios');
            const response = await axios.get("https://kaiz-apis.gleeze.com/api/catfact?apikey=4fe7e522-70b7-420b-a746-d7a23db49ee5");

            const catFact = response.data?.result || "Cats are mysterious creatures.";

            const message = `🐱 ${catFact}`;

            await api.createPost({
                body: message,
                visibility: "Everyone"
            });
        } catch (error) {
            console.error('Error auto-posting cat fact:', error?.message || error);
        } finally {
            isPosting = false;
        }
    };

    // Post once immediately
    postCatFact();

    // Repeat every 10 minutes
    setInterval(postCatFact, 10 * 60 * 1000);
};