const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are a friendly AI assistant for Mofix Studio, a professional photography studio in Kigali, Rwanda.

Your job is to help visitors with:
- Learning about our photography services (portraits, events, weddings, commercial)
- Understanding how to book a session through our platform
- Portfolio and gallery questions
- General photography inquiries
- Directing users to the right pages on our website

Guidelines:
- Keep answers short, warm, and helpful (2-4 sentences max)
- For specific pricing, direct users to the Services page
- For bookings, tell them to create an account then visit a service page to book
- For urgent matters, direct them to our Contact page
- If unsure, suggest they browse the site or contact us directly
- Never make up specific prices or dates`;

exports.chat = async (req, res) => {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ success: false, message: 'Messages array is required' });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
        return res.status(503).json({ success: false, message: 'AI service not configured' });
    }

    const response = await client.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 400,
        system: SYSTEM_PROMPT,
        messages: messages.slice(-10).map(m => ({ role: m.role, content: m.content }))
    });

    res.json({ success: true, message: response.content[0].text });
};
