export type StateType = {
    age: number
    childrenCount: number
    name: string
}

type ActionType = ReturnType <typeof incrementAge>
                | ReturnType<typeof incrementChildrenCount>
                | ReturnType<typeof changeName>


const initialState: StateType = {
    age: 27,
    childrenCount: 1,
    name: 'Dimych'
}

export const userReducer = (state: StateType = initialState, action: ActionType): StateType => {
    switch(action.type){
        case 'INCREMENT-AGE':
            return {
                ...state,
                age: state.age +1
            }
        case 'INCREMENT-CHILDREN-COUNT':
            return {
                ...state,
                childrenCount: state.childrenCount +1
            }
        case 'CHANGE-NAME':
            return {
                ...state,
                name: action.name
            }
    default:
        return state
    }
}

export const incrementAge = () => ({type: 'INCREMENT-AGE'} as const);
export const incrementChildrenCount = () => ({type: 'INCREMENT-CHILDREN-COUNT'} as const);
export const changeName = (name: string) => ({type: 'CHANGE-NAME', name} as const);
