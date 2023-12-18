const { OpenAIClient, AzureKeyCredential } = require("@azure/openai");

class AzureOpenAiService {
    constructor() {
        this.openai = new OpenAIClient(process.env.AZURE_OPENAI_BASE_PATH,
             new AzureKeyCredential(process.env.AZURE_OPENAI_API_KEY));
    }
    async generateMessage(prompt) {

        try {
            const response = await this.openai.getCompletions(
                "text-davinci-003",
                [ prompt ],
                {
                    temperature: 0.6,
                    maxTokens: 200
                }
                
            );
            
            let result = response.choices[0].text;

            return result.trim();

        } catch (e) {

            console.log(`Error ${e}`);
            return "Error";

        }

    }
}

module.exports.OpenAiService = new AzureOpenAiService();