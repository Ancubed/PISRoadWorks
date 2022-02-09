import { getSession } from 'next-auth/react'

/**
 *
 * @param {*} res - Ответ на запрос
 * @param {number} statusCode - HTTP код ответа
 * @param {any} data - Данные в случае успеха
 * @param {string} message - Дополнительное сообщение к ответу
 * @param {boolean} isSuccess - Флаг, позволяющий переопределить успешен ли 200 запрос
 */

export function sendJson(res, statusCode = 500, data = null, message = null, isSuccess = true) {
    const json = {
        isSuccess: false,
    }

    if (statusCode == 200) {
        if (isSuccess) {
            json.data = data;
        }
        json.isSuccess = isSuccess;
    } else {
        json.status = `Ошибка ${statusCode}`;
    }

    if (message) {
        json.message = message;
    }

    res.status(statusCode).json(json);
}

export function generateApiError(message, statusCode = 500) {
    let err = new Error(message);
    err.statusCode = statusCode;
    return err;
}

export function catchApiError(err, res) {
    console.error(err);
    return sendJson(res, err.statusCode || 500, null, err.message);
}

export async function isSession(req) {
    const session = await getSession({ req });
    if (session && session.user) {
        return true;
    }
    return false;
}

export async function isAdminSession(req) {
    const session = await getSession({ req });
    if (session && session.user && session.user.role.id == 0) {
        return true;
    }
    return false;
}
