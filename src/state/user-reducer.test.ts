import { StateType, userReducer, incrementAge, incrementChildrenCount, changeName } from './user-reducer';


test.skip('user reducer should icrement only age', () => {
    const startState: StateType = {
        age: 27,
        childrenCount: 1,
        name: 'Dimych',
    };

    const endState = userReducer(startState, incrementAge());

    expect(endState.name).toBe('Dimych');
    expect(endState.age).toBe(28);
    expect(endState.childrenCount).toBe(1);
});
test.skip('user reducer should icrement only childrenCount', () => {
    const startState: StateType = {
        age: 27,
        childrenCount: 1,
        name: 'Dimych',
    };

    const endState = userReducer(startState,  incrementChildrenCount());

    expect(endState.name).toBe('Dimych');
    expect(endState.age).toBe(27);
    expect(endState.childrenCount).toBe(2);
});
test.skip('user reducer change name of user', () => {
    const startState: StateType = {
        age: 27,
        childrenCount: 1,
        name: 'Dimych',
    };
    const newName = 'Victor';

    const endState = userReducer(startState,  changeName(newName));

    expect(endState.name).toBe('Victor');
    expect(endState.age).toBe(27);
    expect(endState.childrenCount).toBe(1);
});
