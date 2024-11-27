export const dealAdd = async (sendName, sendNumber, code, brand, name, grip, bend, rigidity, price, count, renew, height, type) => {
    let typeRu = ' '
    switch (type) {
        case 'original':
            typeRu = 'оригинал'
            break

        case 'replica':
            typeRu = 'реплика'
            break

        case 'restored':
            typeRu = 'восстановленный / бу'
            break
    
        default:
            break
    }

    const response = await fetch('https://api.telegram.org/bot8010390235:AAGwBBYQIqb93oVxPxFgfZrKIRmt98CrggE/sendMessage', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            chat_id: '525881782',
            text: `ЗАКАЗ\nИмя: ${sendName}\nТелефон: ${sendNumber}\nАртикул: ${code}\nФирма: ${brand}\nНазвание: ${name}\nХват: ${grip}\nЗагиб: ${bend}\nЖесткость: ${rigidity}\n${height ? `Высота: ${height}\n` : ''}${renew ? `Ремонт: ${renew}\n` : ''}Тип: ${typeRu}\nЦена: ${price}₽\nКоличество: ${count}`
        }),
    })

    if (!response.ok) {
        throw new Error('Ошибка при отправке сообщения в бота')
    }

    const data = await response.json()
    return data
}

export const formAdd = async (sendNumber) => {
    const response = await fetch('https://api.telegram.org/bot8010390235:AAGwBBYQIqb93oVxPxFgfZrKIRmt98CrggE/sendMessage', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            chat_id: '525881782',
            text: `ЗАЯВКА НА ЗВОНОК\nТелефон: ${sendNumber}`
        }),
    })

    if (!response.ok) {
        throw new Error('Ошибка при отправке сообщения в бота')
    }

    const data = await response.json()
    return data
}

export const callAdd = async (sendName, sendNumber) => {
    const response = await fetch('https://api.telegram.org/bot8010390235:AAGwBBYQIqb93oVxPxFgfZrKIRmt98CrggE/sendMessage', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            chat_id: '525881782',
            text: `ЗАЯВКА НА ЗВОНОК\nИмя: ${sendName}\nТелефон: ${sendNumber}`
        }),
    })

    if (!response.ok) {
        throw new Error('Ошибка при отправке сообщения в бота')
    }

    const data = await response.json()
    return data
}