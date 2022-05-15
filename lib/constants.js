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
    'new': 'text-green-500',
    'submitted': 'text-yellow-500', 
    'rejected': 'text-rose-500',
    'inProgress': 'text-sky-500',
    'done': 'text-gray-500',
    'expired': 'text-yellow-500'
}