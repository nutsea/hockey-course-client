import $ from 'jquery'

export const dealAdd = (sendName, sendNumber, code, brand, name, grip, bend, rigidity, price, count, renew, height, type) => {
    const contactData = {
        fields: {
            NAME: `${sendName}`,
            PHONE: [{ VALUE: `+${sendNumber}`, VALUE_TYPE: 'WORK' }]
        }
    }

    let newType = ' '
    switch (type) {
        case 'original':
            newType = 'оригинал'
            break

        case 'replica':
            newType = 'реплика'
            break

        case 'restored':
            newType = 'восстановленный / бу'
            break
    
        default:
            break
    }

    $.ajax({
        url: process.env.REACT_APP_BX_URL + 'crm.contact.add',
        type: 'POST',
        data: JSON.stringify(contactData),
        contentType: 'application/json',
        success: function (contactResult) {
            console.log('Клиент успешно создан:', contactResult)

            const dealData = {
                fields: {
                    TITLE: 'ЗАКАЗ С САЙТА',
                    TYPE_ID: 'GOODS',
                    STAGE_ID: 'NEW',
                    CONTACT_ID: contactResult.result,
                    OPENED: 'Y',
                    ASSIGNED_BY_ID: 1,
                    CURRENCY_ID: 'RUB',
                    OPPORTUNITY: price * count,
                    COMMENTS: `Артикул: ${code}\nФирма: ${brand}\nНазвание: ${name}\nХват: ${grip}\nЗагиб: ${bend}\nЖесткость: ${rigidity}\n${height ? `Высота: ${height}\n` : ''}${renew ? `Ремонт: ${renew}\n` : ''}Тип: ${newType}\nЦена: ${price}₽\nКоличество: ${count}`
                }
            }

            $.ajax({
                url: process.env.REACT_APP_BX_URL + 'crm.deal.add',
                type: 'POST',
                data: JSON.stringify(dealData),
                contentType: 'application/json',
                success: function (dealResult) {
                    console.log('Сделка успешно создана:', dealResult)
                },
                error: function (dealError) {
                    console.error('Ошибка при создании сделки:', dealError)
                }
            })
        },
        error: function (contactError) {
            console.error('Ошибка при создании клиента:', contactError)
        }
    })
}

export const callAdd = (sendName, sendNumber) => {
    const contactData = {
        fields: {
            NAME: `${sendName}`,
            PHONE: [{ VALUE: `+${sendNumber}`, VALUE_TYPE: 'WORK' }]
        }
    }

    $.ajax({
        url: process.env.REACT_APP_BX_URL + 'crm.contact.add',
        type: 'POST',
        data: JSON.stringify(contactData),
        contentType: 'application/json',
        success: function (contactResult) {
            console.log('Клиент успешно создан:', contactResult)

            const dealData = {
                fields: {
                    TITLE: 'ЗАЯВКА НА ЗВОНОК',
                    STAGE_ID: 'NEW',
                    CONTACT_ID: contactResult.result,
                    OPENED: 'Y'
                }
            }

            $.ajax({
                url: process.env.REACT_APP_BX_URL + 'crm.deal.add',
                type: 'POST',
                data: JSON.stringify(dealData),
                contentType: 'application/json',
                success: function (dealResult) {
                    console.log('Сделка успешно создана:', dealResult)
                },
                error: function (dealError) {
                    console.error('Ошибка при создании сделки:', dealError)
                }
            })
        },
        error: function (contactError) {
            console.error('Ошибка при создании клиента:', contactError)
        }
    })
}


export const formAdd = (sendNumber) => {
    const contactData = {
        fields: {
            NAME: 'Без имени',
            PHONE: [{ VALUE: `+${sendNumber}`, VALUE_TYPE: 'WORK' }]
        }
    }

    $.ajax({
        url: process.env.REACT_APP_BX_URL + 'crm.contact.add',
        type: 'POST',
        data: JSON.stringify(contactData),
        contentType: 'application/json',
        success: function (contactResult) {
            console.log('Клиент успешно создан:', contactResult)

            const dealData = {
                fields: {
                    TITLE: 'ЗАЯВКА НА ЗВОНОК',
                    STAGE_ID: 'NEW',
                    CONTACT_ID: contactResult.result,
                    OPENED: 'Y'
                }
            }

            $.ajax({
                url: process.env.REACT_APP_BX_URL + 'crm.deal.add',
                type: 'POST',
                data: JSON.stringify(dealData),
                contentType: 'application/json',
                success: function (dealResult) {
                    console.log('Сделка успешно создана:', dealResult)
                },
                error: function (dealError) {
                    console.error('Ошибка при создании сделки:', dealError)
                }
            })
        },
        error: function (contactError) {
            console.error('Ошибка при создании клиента:', contactError)
        }
    })
}