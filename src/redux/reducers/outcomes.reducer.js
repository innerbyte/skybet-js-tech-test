import * as CONST from '../constants/';

let initial_state = [];

export default (state = initial_state, action) => {
    switch (action.type) {
        case CONST.ADD_OUTCOMES:
            return [
                ...state,
                action.outcome
            ];
        case CONST.UPDATE_OUTCOMES:
            let outcome = state.find((v, i ,a) => {
                return v.outcomeId === action.outcome.outcomeId;
            });

            if (outcome)
                return state.map((v, i, a) => {
                    if (v.outcomeId === action.outcome.outcomeId)
                        return Object.assign({}, v, action.outcome);
                    else
                        return v;
                })
            else
                return [
                  ...state,
                  action.outcome
                ];
            break;
        default:
            return state;
    }
};