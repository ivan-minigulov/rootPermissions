const monthsShort = [
    "янв",
    "фев",
    "мар",
    "апр",
    "май",
    "июн",
    "июл",
    "авг",
    "сен",
    "окт",
    "ноя",
    "дек",
];
const monthsF = [
    "января",
    "февраля",
    "марта",
    "апреля",
    "мая",
    "июня",
    "июля",
    "августа",
    "сентября",
    "октября",
    "ноября",
    "декабря",
];

/**
 * Запуск перевода Json в FormData
 * @param data
 * @returns {FormData}
 */
function jsonToFormData(data) {
    const formData = new FormData();

    buildFormData(formData, data);

    return formData;
}

/**
 * рекурсивно переводит элемент Json в FormData
 * @param formData
 * @param data
 * @param parentKey
 */
function buildFormData(formData, data, parentKey) {
    if (
        data &&
        typeof data === "object" &&
        !(data instanceof Date) &&
        !(data instanceof File)
    ) {
        Object.keys(data).forEach((key) => {
            buildFormData(
                formData,
                data[key],
                parentKey ? `${parentKey}[${key}]` : key
            );
        });
    } else {
        const value = data == null ? "" : data;

        formData.append(parentKey, value);
    }
}

/**
 * проверяет есть ли параметр в объекте
 * @returns {boolean}
 */
function has(_object, _key) {
    return Object.prototype.hasOwnProperty.call(_object, _key);
}

/**
 * Клонирует объект
 * @param _object
 * @returns {any}
 */
function cloneObject(_object) {
    return JSON.parse(JSON.stringify(_object));
}

/**
 * форматирует дату dateFormat(new Date(),'d-m-Y')
 * @param _date
 * @param _mask
 * @returns {string}
 */
function dateFormat(_date, _mask) {
    let result = _mask;
    result = result.replace("Y", _date.getFullYear());
    result = result.replace("m", ("0" + (_date.getMonth() + 1)).slice(-2));
    result = result.replace("M", monthsShort[_date.getMonth()]);
    result = result.replace("F", monthsF[_date.getMonth()]);
    result = result.replace("d", ("0" + _date.getDate()).slice(-2));
    result = result.replace("H", ("0" + _date.getHours()).slice(-2));
    result = result.replace("i", ("0" + _date.getMinutes()).slice(-2));
    result = result.replace("s", ("0" + _date.getSeconds()).slice(-2));

    return result;
}

/**
 * для склонения слов к числительным
 * @param number - число
 * @param words - массив из трех [числительное для одного, числительное для 2х, числительное для 5ти] (н-р )[заказ,заказа,заказов]
 * @returns {*}
 */
function pluralForm(number, words) {
    const cases = [2, 0, 1, 1, 1, 2];
    return words[
        number % 100 > 4 && number % 100 < 20
            ? 2
            : cases[Math.min(number % 10, 5)]
    ];
}
//Добавляет action в state при инициализации
function getActionsInitially(
    rootPermissionTitles,
    rootPermission,
    arrayKeys = []
) {
    if (!rootPermissionTitles.items) {
        const actions = arrayKeys.reduce((prevObj, key) => {
            return prevObj[key];
        }, rootPermission);
        rootPermissionTitles.action = actions.action;
        rootPermissionTitles.check = false;
        return;
    }

    Object.keys(rootPermissionTitles.items).forEach((key) => {
        arrayKeys.push(key);
        rootPermissionTitles.items[key].check = false;
        getActionsInitially(
            rootPermissionTitles.items[key],
            rootPermission,
            arrayKeys
        );
        arrayKeys.pop();
    });
}
//Обновляет права в state
function updateRootPermission(state, payload, action) {
    //рекурсивный поиск пути в дереве
    function searchPath(state, modal, checkBoolean) {
        if (!state.items && state === modal) {
            state.check = checkBoolean;
            return [1];
        } else if (!state.items && state !== modal) {
            if (Object.values(state.action).indexOf(1) !== -1) {
                return [2];
            }
            return;
        }
        let check = [];
        Object.values(state.items).forEach((item) => {
            const checkRes = searchPath(item, modal, checkBoolean);
            if (checkRes && checkRes.includes(1)) {
                item.check = checkBoolean;
                check.push(1);
            }
            if (checkRes && checkRes.includes(2)) {
                item.check = true;
                check.push(2);
            }
        });
        return check;
    }
    //Обновляет права в state рекурсивно
    function updateRecurssuion(modal, state, check) {
        if (modal.action) {
            Object.keys(modal.action).forEach((nameAction) => {
                modal.action[nameAction] = !check ? 1 : 0;
            });
            searchPath(state[0], modal, !check);
            return;
        } else {
            Object.values(modal.items).forEach((item) => {
                updateRecurssuion(item, state, check);
            });
        }
    }
    if (action) {
        payload.action[action] = payload.action[action] === 0 ? 1 : 0;
        const check =
            Object.values(payload.action).indexOf(1) !== -1 ? true : false;
        searchPath(state[0], payload, check);
    } else {
        updateRecurssuion(payload, state, payload.check);
    }
}

export {
    has,
    cloneObject,
    dateFormat,
    pluralForm,
    jsonToFormData,
    getActionsInitially,
    updateRootPermission,
};
