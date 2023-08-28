const { OpenAI } = require("openai");

class OpenAiService {
    constructor() {
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY 
        });
    }

    async generateMessage(prompt) {

        try {

            const response = await this.openai.completions.create({
                model: "text-davinci-003",
                prompt: prompt,
                temperature: 0.6,
                max_tokens: 100
            });        
            let result = response.choices[0].text;
            return result.trim();

        } catch (e) {

            console.log(`Error ${e.response.status} ${e.response.statusText}`);
            return "Error";

        }

    }
}

module.exports.OpenAiService = new OpenAiService();