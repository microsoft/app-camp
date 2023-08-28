const {  OpenAI } = require("openai");

class AzureOpenAiService {
    constructor() {
        this.openai = new OpenAI({            
            basePath:process.env.AZURE_OPENAI_BASE_PATH +
                       "/deployments/" + process.env.AZURE_OPENAI_MODEL
        });
    }
    async generateMessage(prompt) {

        try {

            const response = await this.openai.completions.create({
                prompt: prompt,
                model:"text-davinci-003",
                temperature: 0.6,
                max_tokens: 100
            }, {
                headers: {
                    'api-key': process.env.AZURE_OPENAI_API_KEY,
                  },
                  params: { "api-version": process.env.AZURE_OPENAI_API_VERSION }
            });

            let result = response.choices[0].text;

            return result.trim();

        } catch (e) {

            console.log(`Error ${e.response.status} ${e.response.statusText}`);
            return "Error";

        }

    }
}

module.exports.OpenAiService = new AzureOpenAiService();