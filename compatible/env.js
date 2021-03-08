let _getStorageSync = null;
let _setStorageSync = null;
if (window.hasOwnProperty("uni")) {
    //uniapp环境中
    _getStorageSync = uni.getStorageSync;
    _setStorageSync = uni.setStorageSync;
}
else {
    //普通h5环境中
    _getStorageSync = (key) => JSON.parse(localStorage.getItem(key));
    _setStorageSync = (key, value) => {
        localStorage.setItem(key, JSON.stringify(value));
    };
}
export const getStorageSync = (key) => {
    try {
        const storage = _getStorageSync(key);
        if (storage)
            return storage;
        else
            return null;
    }
    catch (error) {
        return null;
    }
};
export const setStorageSync = (key, value) => {
    try {
        _setStorageSync(key, value);
        return true;
    }
    catch (error) {
        return false;
    }
};
