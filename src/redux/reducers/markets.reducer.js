import * as CONST from '../constants/';

let initial_state = [];

export default (state = initial_state, action) => {
    switch (action.type) {
        case CONST.ADD_MARKET:
            if (state.find(v => v.marketId === action.market.marketId))
                return state.map((v, i, a) => {
                    if (v.marketId === action.market.marketId)
                        return Object.assign({}, v, action.market);
                    else
                        return v;
                });
            else
                return [
                    ...state,
                    action.market
                ];
        case CONST.UPDATE_MARKET:
            let market = state.find((v, i ,a) => {
                return v.marketId === action.market.marketId;
            });

            if (market)
                return state.map((v, i, a) => {
                    if (v.marketId === action.market.marketId)
                        return Object.assign({}, v, action.market);
                    else
                        return v;
                })
            else
                return [
                  ...state,
                  action.market
                ];
            break;
        default:
            return state;
    }
};