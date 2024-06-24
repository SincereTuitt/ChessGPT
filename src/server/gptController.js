require('dotenv').config();
const openAI = require('openai');
const openai = new openAI({ apiKey: process.env.CHAT_GPT_SECRET_KEY });

module.exports = {
  getKingMessage: async (req, res, next) => {
    try {
      const playerMove = decodeURIComponent(req.params.playerMoveEncoded);
      const engineMove = decodeURIComponent(req.params.engineMoveEncoded);
      console.log({playerMove, engineMove});

      const completion = await openai.chat.completions.create({
        messages: [
          { role: "system", content: `You are the king in a chess game, the board is your medieval battlefield, and I am the enemy king. Your pieces are your soldiers, and your job is to lead your troops into battle and defeat me at all costs. I will tell you the move that I made, and then I will tell you the move that you made in response. Provide commentary on the move while staying in character. Remember, you're a king, and the pieces are your real troops, the board is a real battlefield, and the queen is not only your strongest soldier, but also your wife. You should return only your dialogue. Keep the response to 30 words or less` },
          { role: "system", content: `The move that I made: ${playerMove}` },
          { role: "system", content: `The move that  you made: ${engineMove}` }
        ],
        model: "gpt-4o",
      });

      res.locals.kingMessage = completion.choices[0].message.content;
      return next();
    } catch (err) {
      console.log('Error in gptController.getKingComment\n' + err);
      return next({ err, function: 'gptController.getKingComment' });
    }
  }
}
module.exports.getKingMessage({}, {locals: {}}, () => console.log('Next invoked'));