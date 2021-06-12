
const initialState = {
    loggedin: false,
    userData: null
}

export default function userReducer(state = initialState, action) {
    switch (action.type) {
        case 'GET_USER':
            return state.userData
        case 'SET_USER':
            return { ...state, userData: action.payload }
        case 'GET_AUTH':
            return state.loggedin
        case 'SET_AUTH':
            return { ...state, loggedin: action.payload }
        default:
            return state
    }
};