export function getRandomInt(maxRandomInt = 100) {
    return Math.floor(Math.random() * maxRandomInt);
}

export function dateFormatFromISO(dateString) {
    try {
        return dateString.split('T')[0].split('-').reverse().join('.');
    } catch (err) {
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

export function generateColor(value) {
    return (value == 'new' && 'text-green-500'
        ||
        value == 'submitted' && 'text-yellow-500'
        ||
        value == 'rejected' && 'text-rose-500'
        ||
        value == 'inProgress' && 'text-sky-500'
        ||
        value == 'done' && 'text-green-500'
        ||
        value == 'expired' && 'text-yellow-500');
}

export function translit(word) {
    let answer = '';
    let converter = {
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd',
        'е': 'e', 'ё': 'e', 'ж': 'zh', 'з': 'z', 'и': 'i',
        'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n',
        'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't',
        'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'c', 'ч': 'ch',
        'ш': 'sh', 'щ': 'sch', 'ь': '', 'ы': 'y', 'ъ': '',
        'э': 'e', 'ю': 'yu', 'я': 'ya',

        'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D',
        'Е': 'E', 'Ё': 'E', 'Ж': 'Zh', 'З': 'Z', 'И': 'I',
        'Й': 'Y', 'К': 'K', 'Л': 'L', 'М': 'M', 'Н': 'N',
        'О': 'O', 'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T',
        'У': 'U', 'Ф': 'F', 'Х': 'H', 'Ц': 'C', 'Ч': 'Ch',
        'Ш': 'Sh', 'Щ': 'Sch', 'Ь': '', 'Ы': 'Y', 'Ъ': '',
        'Э': 'E', 'Ю': 'Yu', 'Я': 'Ya'
    };

    for (let i = 0; i < word.length; ++i) {
        if (converter[word[i]] == undefined) {
            answer += word[i];
        } else {
            answer += converter[word[i]];
        }
    }

    return answer;
}

export function middlewareWrapper(req, res, fn) {
    return new Promise((resolve, reject) => {
        fn(req, res, (result) => {
            if (result instanceof Error) {
                return reject(result)
            }

            return resolve(result)
        })
    })
}