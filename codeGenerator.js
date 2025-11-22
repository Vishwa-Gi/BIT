import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI("AIzaSyCo4sRl-nTk5lKSd6u7Nn0BzNVKJCOTVrE");

export async function generateWebsite(text) {
    try {
        console.log('Generating website from text:', text);
        
        // Initialize the model
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const prompt = `You are a web development expert. Create a complete, modern website based on this description: ${text}
        Rules:
        1. Return a complete HTML file with embedded CSS and JavaScript
        2. Use modern design principles and a clean layout
        3. Make it fully responsive for all devices
        4. Include all necessary styles in <style> tag
        5. Include all JavaScript in <script> tag
        6. Use semantic HTML5 elements
        7. Add smooth animations and transitions
        8. Ensure the code is complete and ready to run
        9. Include proper meta tags and viewport settings
        10. Use modern CSS features like Flexbox or Grid
        11. Add comments in the code for better understanding
        12. Ensure all interactive elements work properly
        13. Include a header with navigation
        14. Add a footer with contact information
        15. Make sure all sections are properly styled and responsive
        16. Remove everything except the HTML. No triple backticks
        17. Do not include any explanations or extra text, only the code.
        18. In structured format`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const generatedCode = response.text();
        
        console.log('Successfully generated website code, length:', generatedCode.length);
        
        if (!generatedCode || generatedCode.trim() === '') {
            throw new Error('Generated code is empty');
        }

        return generatedCode;
    } catch (error) {
        console.error('Error generating website:', error);
        throw new Error('Failed to generate website: ' + error.message);
    }
}

