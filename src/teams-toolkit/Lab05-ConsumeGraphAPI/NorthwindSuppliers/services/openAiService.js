const { Configuration, OpenAIApi } = require("openai");

class OpenAiService {
    #configuration;

    constructor() {
        this.#configuration = new Configuration({
            apiKey: process.env.OPENAI_API_KEY
        });
        this.openAiClient = new OpenAIApi(this.#configuration);
    }

    async generateMessage(prompt) {

        try {

            const response = await this.openAiClient.createCompletion({
                model: "text-davinci-003",
                prompt: prompt,
                temperature: 0.6,
                max_tokens: 100
            });

            let result = response.data.choices[0].text;

            return result.trim();

        } catch (e) {

            console.log(`Error ${e.response.status} ${e.response.statusText}`);
            return "Error";

        }

    }
}

module.exports.OpenAiService = new OpenAiService();