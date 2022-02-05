/**
 * 
 * @param {*} res - Ответ на запрос
 * @param {Number} statusCode - HTTP код ответа 
 * @param {any} data - Данные в случае успеха
 * @param {String} message - Дополнительное сообщение к ответу
 */
export function sendJson(res, statusCode = 500, data = null, message = null) {
    const json = {
        statusCode: 0 
    };

    if (statusCode !== 200 || !data) {
        json.status = `Ошибка ${statusCode}`;
    } else {
        json.statusCode = 1;
        json.data = data;
    }
    
    if (message) {
        json.message = message;
    }

    res.status(statusCode).json(json);
}