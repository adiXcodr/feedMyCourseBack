
const saveUserData = (data) => {
    return {
        type: 'SET_USER',
        payload: data
    };
};

const setAuth = (bool) => {
    return {
        type: 'SET_AUTH',
        payload: bool
    };
};

export {
    saveUserData,
    setAuth
};