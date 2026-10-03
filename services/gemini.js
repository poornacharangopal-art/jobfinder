const { GoogleGenAI } = require("@google/genai");

const Createai = () => {

    const ai = new GoogleGenAI({

        apiKey: process.env.API_KEY

    });

    return ai;

};

module.exports = Createai;