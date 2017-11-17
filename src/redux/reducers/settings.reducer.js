import * as CONST from '../constants/';

let initial_state = {
    primary_markets: false,
    decimal_odds: false
};

export default (state = initial_state, action) => {
    switch (action.type) {
        case CONST.UPDATE_SETTINGS:
            return Object.assign({}, state, action.settings);
        default:
            return state;
    }
};