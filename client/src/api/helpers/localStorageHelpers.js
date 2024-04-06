export const localStorageService = {
    get(key) {
        const item = localStorage.getItem(key);
        return item
    },
    set(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    },
    remove(key) {
        localStorage.removeItem(key);
    },
};
