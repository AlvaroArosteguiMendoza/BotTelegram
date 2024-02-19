const TelegramBot = require('node-telegram-bot-api');

/**
 * Función asincrónica para importar la librería 'node-fetch'.
 * @returns {Promise} - Una promesa que resuelve a la librería 'node-fetch'.
 */
async function nodefetch() {
    const { default: fetch } = await import('node-fetch');
}

// Configuración del token de tu bot proporcionado por BotFather en Telegram
const botToken = '6524747015:AAGSR8Ba6cDEHlhyK1JPp8qNbcWAeLIieug';

// Crear un nuevo bot con el token
const bot = new TelegramBot(botToken, { polling: true });

/**
 * Manejar el comando /start.
 * @param {object} msg - El objeto del mensaje de Telegram.
 */
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, '¡Hola! Soy Naputo, tu bot de Naruto. Utiliza el comando /naruto para obtener información específica o /narutoall para obtener la lista completa de personajes.');
});

/**
 * Manejar el comando /naruto.
 * @param {object} msg - El objeto del mensaje de Telegram.
 */
bot.onText(/\/naruto/, async (msg) => {
    const chatId = msg.chat.id;

    try {
        let characterId = null;

        // Verificar si se proporciona un ID específico en el comando
        const match = msg.text.match(/\/naruto (.+)/);
        if (match && match[1]) {
            characterId = match[1];
        }

        // Construir la URL de la API según si se proporciona un ID o no
        const apiUrl = characterId ? `https://narutodb.xyz/api/character/${characterId}` : 'https://narutodb.xyz/api/character';

        // Llamada a la API de NarutoDB usando node-fetch
        const response = await fetch(apiUrl);
        const responseData = await response.json();

        if (Array.isArray(responseData)) {
            // Mostrar la lista completa de personajes
            const characterList = responseData.map(character => character.name).join(', ');
            bot.sendMessage(chatId, `Lista de personajes: ${characterList}`);
        } else {
            // Mostrar información del personaje específico
            const characterData = responseData;
            const message = `
Nombre: ${characterData.name}
Sexo: ${characterData.personal.sex}
Ocupación: ${characterData.personal.occupation}
Afiliación: ${characterData.personal.affiliation.join(', ')}
Jutsu: ${characterData.jutsu.join(', ')}
Imagen: ${characterData.images[0]}
`;

            bot.sendMessage(chatId, message);
        }
    } catch (error) {
        console.error('Error al obtener información de NarutoDB:', error);
        bot.sendMessage(chatId, 'Lo siento, ha ocurrido un error al obtener la información de Naruto. Por favor, intenta de nuevo más tarde.');
    }
});