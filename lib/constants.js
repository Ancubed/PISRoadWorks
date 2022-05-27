export const MAX_FILES_COUNT = 7

export const REQUEST_STATUS_ENUM = {
    'new': 'Новая',
    'submitted': 'В обработке', 
    'rejected': 'Отклонена',
    'inProgress': 'Одобрена',
    'done': 'Завершена',
    'expired': 'Просрочена'
};

export const REQUEST_STATUS_COLOR = {
    'new': {
        'tailwind': 'text-green-500',
        'hex': '0E9F6E'
    },
    'submitted': {
        'tailwind': 'text-yellow-500',
        'hex': '0E9F6E'
    },
    'rejected': {
        'tailwind': 'text-rose-500',
        'hex': '0E9F6E'
    },
    'inProgress': {
        'tailwind': 'text-sky-500',
        'hex': '0E9F6E'
    },
    'done': {
        'tailwind': 'text-gray-500',
        'hex': '0E9F6E'
    },
    'expired': {
        'tailwind': 'text-yellow-500',
        'hex': '0E9F6E'
    }
}