import $ from 'jquery'

// const dealEndpoint = 'crm.deal.add'
// const contactEndpoint = 'crm.contact.add'

const contactData = {
    fields: {
        NAME: 'Имя',
        PHONE: [{ VALUE: '+79999999999', VALUE_TYPE: 'WORK' }], // Номер телефона клиента
    },
}

// const dealData = {
//     fields: {
//         "TITLE": "ЗАКАЗ С САЙТА",
//         "TYPE_ID": "GOODS",
//         "STAGE_ID": "NEW",
//         "COMPANY_ID": 3,
//         "CONTACT_ID": 3,
//         "OPENED": "Y",
//         "ASSIGNED_BY_ID": 1,
//         "PROBABILITY": 30,
//         "CURRENCY_ID": "USD",
//         "OPPORTUNITY": 5000,
//         "CATEGORY_ID": 5,
//         "DESCRIPTION": "Товар: ...\nНомер: 1111111111"
//     }
// }

// export const dealAdd = () => {
//     $.ajax({
//         url: process.env.REACT_APP_BX_URL + dealEndpoint,
//         type: 'POST',
//         data: JSON.stringify(dealData),
//         contentType: 'application/json',
//         success: function (result) {
//             console.log('Сделка успешно создана:', result)
//         },
//         error: function (error) {
//             console.error('Ошибка при создании сделки:', error)
//         }
//     })
// }

export const dealAdd = () => {
    $.ajax({
        url: process.env.REACT_APP_BX_URL + 'crm.contact.add',
        type: 'POST',
        data: JSON.stringify(contactData),
        contentType: 'application/json',
        success: function (contactResult) {
            console.log('Клиент успешно создан:', contactResult);

            // Использование CONTACT_ID нового клиента в сделке
            const dealData = {
                fields: {
                    TITLE: 'ЗАКАЗ С САЙТА',
                    TYPE_ID: 'GOODS',
                    STAGE_ID: 'NEW',
                    // COMPANY_ID: 3,
                    CONTACT_ID: contactResult.result, // Используем CONTACT_ID нового клиента
                    OPENED: 'Y',
                    ASSIGNED_BY_ID: 1,
                    // PROBABILITY: 30,
                    CURRENCY_ID: 'RUB',
                    OPPORTUNITY: 50,
                    // CATEGORY_ID: 5,
                    DESCRIPTION: 'Товар: ...\nНомер: 1111111111',
                },
            };

            // Создание сделки
            $.ajax({
                url: process.env.REACT_APP_BX_URL + 'crm.deal.add',
                type: 'POST',
                data: JSON.stringify(dealData),
                contentType: 'application/json',
                success: function (dealResult) {
                    console.log('Сделка успешно создана:', dealResult);
                },
                error: function (dealError) {
                    console.error('Ошибка при создании сделки:', dealError);
                },
            });
        },
        error: function (contactError) {
            console.error('Ошибка при создании клиента:', contactError);
        },
    });
}