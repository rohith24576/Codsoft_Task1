import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { getGeminiResponse } from "../utils/gemini.js";
import { Product } from "../models/product.model.js";
import { mockProducts } from "./product.controller.js";

const shoppingAssistant = asyncHandler(async (req, res) => {
    const { message, history } = req.body;

    let products = [];
    if (process.env.USE_MOCK_DB === 'true') {
        products = mockProducts.filter(p => p.isFeatured).slice(0, 5);
    } else {
        products = await Product.find({ isFeatured: true }).limit(5).select("name price description");
    }
    
    const productContext = products.map(p => `- ${p.name}: $${p.price}. ${p.description.substring(0, 50)}...`).join("\n");

    const systemPrompt = `You are the "ShopNest AI Assistant", an elite, professional, and helpful shopping guide for ShopNest, a high-end fashion boutique.
    
    Your capabilities include:
    1. Providing style advice and fashion tips.
    2. Recommending products based on user needs (using the context below).
    3. Answering questions about ShopNest (e.g., returns, shipping, brand values).
    4. Helping users find the perfect gift or outfit for specific occasions.
    
    Here are some of our featured products for context:
    ${productContext}
    
    Keep your responses elegant, concise, and helpful. Always maintain a premium "Elite" brand voice.
    
    User message: ${message}`;

    const aiResponse = await getGeminiResponse(systemPrompt);
    console.log("AI Response:", aiResponse);

    res.status(200).json(
        new ApiResponse(200, { response: aiResponse }, "AI response generated")
    );
});

export { shoppingAssistant };
