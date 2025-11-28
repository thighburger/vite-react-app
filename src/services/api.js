import axios from 'axios';

// Mock delay to simulate network latency
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Add request interceptor to include access token
axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

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
        const response = await axios.post('http://133.186.229.94:8001/generate-image', settings);
        return response.data.image;
    } catch (error) {
        console.error('Image generation failed:', error);
        throw error;
    }
};

/**
 * Registers a new user.
 * 
 * @param {Object} userData - User registration data (username, password, passwordConfirm).
 * @returns {Promise<Object>} - The response data.
 */
export const signup = async (userData) => {
    try {
        const response = await axios.post('http://133.186.229.94:8080/auth/signup', userData);
        if (response.data && response.data.accessToken) {
            localStorage.setItem('accessToken', response.data.accessToken);
        }
        return response.data;
    } catch (error) {
        console.error('Signup failed:', error);
        throw error;
    }
};

/**
 * Logs in a user.
 * 
 * @param {Object} userData - User login data (username, password).
 * @returns {Promise<Object>} - The response data.
 */
export const login = async (userData) => {
    try {
        const response = await axios.post('http://133.186.229.94:8080/auth/login', userData);
        if (response.data && response.data.accessToken) {
            localStorage.setItem('accessToken', response.data.accessToken);
        }
        return response.data;
    } catch (error) {
        console.error('Login failed:', error);
        throw error;
    }
};

/**
 * Creates a new chatbot.
 * 
 * @param {Object} botData - Chatbot data (name, personality, appearance).
 * @returns {Promise<Object>} - The response data.
 */
export const createChatBot = async (botData) => {
    try {
        const response = await axios.post('http://133.186.229.94:8080/chatBots', botData);
        console.log(botData);
        return response.data;
    } catch (error) {
        console.error('ChatBot creation failed:', error);
        throw error;
    }
};

/**
 * Sends a message to the chatbot.
 * 
 * @param {string} chatBotId - The ID of the chatbot.
 * @param {string} message - The message to send.
 * @returns {Promise<string>} - The chatbot's response text.
 */
export const sendChatMessage = async (chatBotId, message) => {
    try {
        const response = await axios.post(`http://133.186.229.94:8080/chatBots/1`, { text: message });
        return response.data;
    } catch (error) {
        console.error('Chat message failed:', error);
        throw error;
    }
};

/**
 * Fetches chat history for a specific chatbot.
 * 
 * @param {string} chatBotId - The ID of the chatbot.
 * @returns {Promise<Array>} - The list of chat messages.
 */
export const getChatHistory = async (chatBotId) => {
    try {
        const response = await axios.get(`http://133.186.229.94:8080/chatBots/1`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch chat history:', error);
        throw error;
    }
};

/**
 * Fetches the list of user's chatrooms.
 * 
 * @returns {Promise<Array>} - The list of chatrooms.
 */
export const getChatBots = async () => {
    try {
        const response = await axios.get('http://133.186.229.94:8080/chatBots');
        return response.data;
    } catch (error) {
        console.error('Failed to fetch chat bots:', error);
        throw error;
    }
};

/**
 * Checks if a chatbot exists for the current user/city.
 * 
 * @param {string} cityId - The ID of the city.
 * @returns {Promise<Object|null>} - The chatbot data if exists, otherwise null.
 */
export const checkChatBotExistence = async (cityId) => {
    try {
        const cityMapping = {
            'suncheon': 1,
            'yeosu': 2,
            'damyang': 3,
            'mokpo': 4
        };

        const targetId = cityMapping[cityId];
        if (!targetId) return null;

        const chatBots = await getChatBots();

        // Find if there's a chatbot with the matching ID
        // The user said: "if id:1 is in the array"
        // Assuming the array contains objects with an 'id' field
        const existingBot = chatBots.find(bot => bot.id === targetId);

        if (existingBot) {
            return { chatBotId: existingBot.id, ...existingBot };
        }

        return null;
    } catch (error) {
        console.error('Failed to check chatbot existence:', error);
        return null;
    }
};

/**
 * Deletes a chatbot.
 * 
 * @param {string} chatBotId - The ID of the chatbot to delete.
 * @returns {Promise<void>}
 */
export const deleteChatBot = async (chatBotId) => {
    try {
        await axios.delete(`http://133.186.229.94:8080/chatBots/1`);
    } catch (error) {
        console.error('Failed to delete chatbot:', error);
        throw error;
    }
};
