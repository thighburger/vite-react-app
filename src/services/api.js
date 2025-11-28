import axios from 'axios';

// Mock delay to simulate network latency
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Fetches a chat response from the backend.
 * 
 * @param {string} region - The current region (e.g., 'mokpo').
 * @param {string} message - The user's message.
 * @returns {Promise<string>} - The chatbot's response.
 */
export const fetchChatResponse = async (region, message) => {
    // TODO: Replace with actual API endpoint
    // const response = await axios.get('/api/chat', {
    //   params: { region, msg: message }
    // });
    // return response.data.reply;

    await delay(1000); // Simulate network delay

    // Mock logic for demo purposes
    const lowerMsg = message.toLowerCase();

    if (lowerMsg.includes('안녕')) {
        return `안녕하세요! ${region} 여행 메이트입니다. 무엇을 도와드릴까요?`;
    }

    if (lowerMsg.includes('맛집')) {
        return `${region}에는 맛있는 음식이 정말 많아요! 특히 현지인들이 자주 가는 골목 식당을 추천해 드릴까요?`;
    }

    if (lowerMsg.includes('추천')) {
        return `${region}의 숨겨진 명소를 알려드릴게요. 조용한 산책로와 멋진 야경 포인트가 있어요.`;
    }

    return `그렇군요! ${region} 여행에 대해 더 궁금한 점이 있으신가요? 제가 곁에서 도와드릴게요.`;
};

/**
 * Generates a character image based on settings.
 * 
 * @param {Object} settings - Character settings (name, personality, appearance).
 * @returns {Promise<string>} - The URL of the generated image.
 */
export const generateCharacterImage = async (settings) => {
    try {
        const response = await axios.post('http://localhost:8001/generate-image', settings);
        return response.data.image;
    } catch (error) {
        console.error('Image generation failed:', error);
        throw error;
    }
};
