export const provider = (state = {}, action) => {
    switch (action.type) {
      case 'PROVIDER_LOADED':
        return {
          ...state,
          connection: action.connection
        }
        case "ACCOUNT_LOADED":
            return{
                ...state,
                account: account.account
            }

        default:
            return state
        }
    }
