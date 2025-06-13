import axios from "axios";

const API_KEY = "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";
const BASE_URL = "https://openrouter.ai/api/v1";

function extractCodeBlocks(markdown: string) {
    const htmlMatch = markdown.match(/```html\s*([\s\S]*?)\s*```/);
    const cssMatch = markdown.match(/```css\s*([\s\S]*?)\s*```/);

    return {
        html: htmlMatch ? htmlMatch[1].trim() : "",
        css: cssMatch ? cssMatch[1].trim() : "",
    };
}

export default async function improveComponent(html: string, css: string, componentName: string) {
    const prompt = `
You are a frontend expert. Improve the HTML and CSS quality for the following component: "${componentName}".
Make it cleaner, more modern, and responsive. Use semantic HTML and ensure CSS is scoped and optimized.

--- HTML ---
${html}

--- CSS ---
${css}

Return only the improved HTML and CSS in markdown format:
\`\`\`html
<your improved HTML here>
\`\`\`
\`\`\`css
<your improved CSS here>
\`\`\`
`;

    try {
        const response = await axios.post(
            `${BASE_URL}/chat/completions`,
            {
                model: "deepseek/deepseek-r1-0528:free",
                messages: [
                    {
                        role: "system",
                        content: "You are a helpful assistant who improves web components.",
                    },
                    {
                        role: "user",
                        content: prompt,
                    },
                ],
            },
            {
                headers: {
                    Authorization: `Bearer ${API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        const raw = response.data.choices?.[0]?.message?.content;
        if (!raw) throw new Error("No response content from model");
        
        console.log(extractCodeBlocks(raw));
        

        return extractCodeBlocks(raw);
    } catch (error: any) {
        console.error("Error calling DeepSeek API:", error.response?.data || error.message);
        throw error;
    }
}
