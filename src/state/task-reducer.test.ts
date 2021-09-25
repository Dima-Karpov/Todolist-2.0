import { v1 } from "uuid";
import { TasksStateType } from "../App";
import { addTask, removeTask, taskReducer, changeStatus, changeTitle } from "./task-reducer";
import { addTodolist } from "./todolist-reducer";

test('the unnecessary task is removed from the required tudulist', () => {
    const todolistId1 = v1();
    const todolistId2 = v1();

    let startState: TasksStateType = {
        [todolistId1]: [
            { id: '1', title: 'HTML', isDone: true },
            { id: '2', title: 'CSS', isDone: true },
            { id: '3', title: 'React', isDone: false },
        ],
        [todolistId2]: [
            { id: '1', title: 'HTML', isDone: true },
            { id: '2', title: 'CSS', isDone: true },
            { id: '3', title: 'React', isDone: false },
        ],
    }

    const endState = taskReducer(startState, removeTask(startState[todolistId2][0].id, todolistId2));

    expect(endState[todolistId1].length).toBe(3);
    expect(endState[todolistId2].length).toBe(2);
    expect(endState[todolistId2].every(t => t.id !== '1')).toBeTruthy();


});
test('a new task is added to the desired tudulist', () => {
    const todolistId1 = v1();
    const todolistId2 = v1();

    let startState: TasksStateType = {
        'todolistId1': [
            { id: '1', title: 'HTML', isDone: true },
            { id: '2', title: 'CSS', isDone: true },
            { id: '3', title: 'React', isDone: false },
        ],
        'todolistId2': [
            { id: '1', title: 'HTML', isDone: true },
            { id: '2', title: 'CSS', isDone: true },
            { id: '3', title: 'React', isDone: false },
        ]
    }

    const endState = taskReducer(startState, addTask('New task', 'todolistId2'));

    expect(endState['todolistId1'].length).toBe(3);
    expect(endState['todolistId2'].length).toBe(4);
});
test('the status in the required task must change', () => {
    const todolistId1 = v1();
    const todolistId2 = v1();

    let startState: TasksStateType = {
        'todolistId1': [
            { id: '1', title: 'HTML', isDone: true },
            { id: '2', title: 'CSS', isDone: true },
            { id: '3', title: 'React', isDone: false },
        ],
        'todolistId2': [
            { id: '1', title: 'HTML', isDone: true },
            { id: '2', title: 'CSS', isDone: true },
            { id: '3', title: 'React', isDone: false },
        ]
    }
    2
    const endState = taskReducer(startState, changeStatus('3', true, 'todolistId1'));

    expect(endState['todolistId1'].length).toBe(3);
    expect(endState['todolistId1'][2].title).toBe('React');
    expect(endState['todolistId1'][2].id).toBe('3');
    expect(endState['todolistId1'][2].isDone).toBe(true);
});
test('the title in the required task must change', () => {
    const todolistId1 = v1();
    const todolistId2 = v1();

    let startState: TasksStateType = {
        'todolistId1': [
            { id: '1', title: 'HTML', isDone: true },
            { id: '2', title: 'CSS', isDone: true },
            { id: '3', title: 'React', isDone: false },
        ],
        'todolistId2': [
            { id: '1', title: 'HTML', isDone: true },
            { id: '2', title: 'CSS', isDone: true },
            { id: '3', title: 'React', isDone: false },
        ]
    }

    const endState = taskReducer(startState, changeTitle('3', 'Redux', 'todolistId1'));

    expect(endState['todolistId1'].length).toBe(3);
    expect(endState['todolistId1'][2].title).toBe('Redux');
});


// Todolist
test('new property with new array should be added when new todolsit is added', () => {
    const startState: TasksStateType = {
        'todolistId1': [
            { id: '1', title: 'HTML', isDone: true },
            { id: '2', title: 'CSS', isDone: true },
            { id: '3', title: 'React', isDone: false },
        ],
        'todolistId2': [
            { id: '1', title: 'HTML', isDone: true },
            { id: '2', title: 'CSS', isDone: true },
            { id: '3', title: 'React', isDone: false },
        ],
    }

    const endState = taskReducer(startState, addTodolist('new todolist'));

    const keys = Object.keys(endState);
    const newKey = keys.find(k => k !== 'todolistId1' && k !== 'todolistId2');
    if (!newKey) {
        throw Error('new key should be added');
    }

    expect(keys.length).toBe(3);
    expect(endState[newKey]).toEqual([])
})