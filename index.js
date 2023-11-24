const TelegramApi = require("node-telegram-bot-api");
const {gameOptions, againOptions} = require('./options');

const token = "6844559901:AAFOiD68np4OE0Wf6tDyd6peuYnKTJcEllI";

const bot = new TelegramApi(token, { polling: true });

const chats = {};



bot.setMyCommands([
  { command: "/start", description: "Начальное приветствие" },
  { command: "/info", description: "Получить информацию о пользователе" },
  { command: "/game", description: "Игра угадай число" },
]);

const startGame = async (chatId) => {
  await bot.sendMessage(
    chatId,
    "Сейчас я загадаю число от 0 до 9, а ты доджени ее угадать"
  );
  const randomNumber = Math.floor(Math.random() * 10);
  chats[chatId] = randomNumber;
  await bot.sendMessage(chatId, "Отгадай", gameOptions);
};

const start = () => {
  bot.on("message", async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;

    if (text === "/start") {
      await bot.sendSticker(
        chatId,
        "https://chpic.su/_data/stickers/u/UaMicroCats/UaMicroCats_001.webp"
      );
      return bot.sendMessage(chatId, `Добро пожаловать`);
    } else if (text === "/info") {
      return bot.sendMessage(
        chatId,
        `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`
      );
    } else if (text === "/game") {
        return startGame(chatId)
    } else {
      return bot.sendMessage(chatId, "Я тебя не понимаю, попробуй еще раз!)");
    }
  });

  bot.on("callback_query", async (msg) => {
    const data = msg.data;
    const chatId = msg.message.chat.id;

    if (data === "/again") {
        return startGame(chatId)
    }

    if (data === chats[chatId]) {
      return await bot.sendMessage(
        chatId, 
        `Поздравляю ты отгадал число ${chats[chatId]}`,
        againOptions
      );
    } else {
      return await bot.sendMessage(
        chatId,
        `К сожалению ты не угадал, бот загадал число ${chats[chatId]}`,
        againOptions
      );
    }
  });
};

start();
