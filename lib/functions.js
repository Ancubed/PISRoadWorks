export function dateFormatFromISO(dateString) {
    try {
        return dateString.split('T')[0].split('-').reverse().join('.');
    } catch(err) {
        return 'Неизвстная дата';
    }
}

export async function fetcher(...args) {
    let res = await fetch(...args)
    if (!res.ok) throw new Error('Error');
    let json = await res.json();
    if (!json.data) throw new Error(json.message || 'Неизвестная ошибка');
    return json.data;
}

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

export function notSuccess200Json(res, message) {
    return sendJson(res, 200, null, message, false);
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

export function isSession(session) {
    if (session && session.user) {
        return true;
    }
    return false;
}

export function isAcceptByRole(session, roleArr = [0]) {
    if (isSession(session)) {
        return roleArr.filter((roleId) => roleId === session.user.role.id).length > 0;
    }
    return false;
}

export function isOwnerDataSession(session, id) {
    if (id && isSession(session) && session.user.id == id) {
        return true;
    }
    return false;
}

export function trimAllString(str) {
    return str.trim().split(/\s+/).map(elem => elem.trim()).join(' ')
}

export function trimBody(req) {
    if (req.body && Object.keys(req.body).length != 0) {
        Object.keys(req.body).forEach(key => {
            if (typeof req.body[key] === 'string') {
                req.body[key] = trimAllString(req.body[key]);
            }
        })
    }
}
