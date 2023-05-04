const { Configuration, OpenAIApi } = require("openai");

class AzureOpenAiService {
    #configuration;

    constructor() {

        this.#configuration = new Configuration({
            basePath: process.env.AZURE_OPENAI_BASE_PATH +
                "/deployments/" + process.env.AZURE_OPENAI_MODEL
        });
        this.openAiClient = new OpenAIApi(this.#configuration);
    }

    async generateMessage(prompt) {

        try {

            const response = await this.openAiClient.createCompletion({
                prompt: prompt,
                temperature: 0.0,
                max_tokens: 400
            }, {
                headers: {
                    'api-key': process.env.AZURE_OPENAI_API_KEY,
                  },
                  params: { "api-version": process.env.AZURE_OPENAI_API_VERSION }
            });

            let result = response.data.choices[0].text;

            return result.trim();

        } catch (e) {

            console.log(`Error ${e.response.status} ${e.response.statusText}`);
            return "Error";

        }

    }
}

module.exports.OpenAiService = new AzureOpenAiService();