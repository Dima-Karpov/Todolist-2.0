import { v1 } from "uuid";
import { TaskPriorities, TaskStatuses } from "../../dal/todolists-api";
import { addTaskAC, removeTaskAC, taskReducer, changeStatusAC, changeTitleAC, TasksStateType, setTasks } from "../task-reducer";
import { addTodolistAC } from "../todolist-reducer";


let startState: TasksStateType = {};
beforeEach(() => {
    startState = {
        'todolistId1': [
            {id: '1', title: 'CSS', status: TaskStatuses.New, todoListId: 'todolistId1', description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low},
            {id: '2', title: 'JS', status: TaskStatuses.New, todoListId: 'todolistId1', description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low},
            {id: '3', title: 'REACT', status: TaskStatuses.New, todoListId: 'todolistId1', description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low},
        ],
        'todolistId2': [
            {id: '1', title: 'bread', status: TaskStatuses.New, todoListId: 'todolistId2', description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low},
            {id: '2', title: 'milk', status: TaskStatuses.Completed, todoListId: 'todolistId2', description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low},
            {id: '3', title: 'tea', status: TaskStatuses.New, todoListId: 'todolistId2', description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low},
        ],
    };
})

// test('the unnecessary task is removed from the required tudulist', () => {
//     const todolistId1 = v1();
//     const todolistId2 = v1();

//     let startState: TasksStateType = {
//         [todolistId1]: [
//             { id: '1', title: 'HTML', isDone: true },
//             { id: '2', title: 'CSS', isDone: true },
//             { id: '3', title: 'React', isDone: false },
//         ],
//         [todolistId2]: [
//             { id: '1', title: 'HTML', isDone: true },
//             { id: '2', title: 'CSS', isDone: true },
//             { id: '3', title: 'React', isDone: false },
//         ],
//     }

//     const endState = taskReducer(startState, removeTaskAC(startState[todolistId2][0].id, todolistId2));

//     expect(endState[todolistId1].length).toBe(3);
//     expect(endState[todolistId2].length).toBe(2);
//     expect(endState[todolistId2].every(t => t.id !== '1')).toBeTruthy();


// });
// test('a new task is added to the desired tudulist', () => {
//     const todolistId1 = v1();
//     const todolistId2 = v1();

//     let startState: TasksStateType = {
//         'todolistId1': [
//             { id: '1', title: 'HTML', isDone: true },
//             { id: '2', title: 'CSS', isDone: true },
//             { id: '3', title: 'React', isDone: false },
//         ],
//         'todolistId2': [
//             { id: '1', title: 'HTML', isDone: true },
//             { id: '2', title: 'CSS', isDone: true },
//             { id: '3', title: 'React', isDone: false },
//         ]
//     }

//     const endState = taskReducer(startState, addTaskAC('New task', 'todolistId2'));

//     expect(endState['todolistId1'].length).toBe(3);
//     expect(endState['todolistId2'].length).toBe(4);
// });
// test('the status in the required task must change', () => {
//     const todolistId1 = v1();
//     const todolistId2 = v1();

//     let startState: TasksStateType = {
//         'todolistId1': [
//             { id: '1', title: 'HTML', isDone: true },
//             { id: '2', title: 'CSS', isDone: true },
//             { id: '3', title: 'React', isDone: false },
//         ],
//         'todolistId2': [
//             { id: '1', title: 'HTML', isDone: true },
//             { id: '2', title: 'CSS', isDone: true },
//             { id: '3', title: 'React', isDone: false },
//         ]
//     }
//     2
//     const endState = taskReducer(startState, changeStatusAC('3', true, 'todolistId1'));

//     expect(endState['todolistId1'].length).toBe(3);
//     expect(endState['todolistId1'][2].title).toBe('React');
//     expect(endState['todolistId1'][2].id).toBe('3');
//     expect(endState['todolistId1'][2].isDone).toBe(true);
// });
// test('the title in the required task must change', () => {
//     const todolistId1 = v1();
//     const todolistId2 = v1();

//     let startState: TasksStateType = {
//         'todolistId1': [
//             { id: '1', title: 'HTML', isDone: true },
//             { id: '2', title: 'CSS', isDone: true },
//             { id: '3', title: 'React', isDone: false },
//         ],
//         'todolistId2': [
//             { id: '1', title: 'HTML', isDone: true },
//             { id: '2', title: 'CSS', isDone: true },
//             { id: '3', title: 'React', isDone: false },
//         ]
//     }

//     const endState = taskReducer(startState, changeTitleAC('3', 'Redux', 'todolistId1'));

//     expect(endState['todolistId1'].length).toBe(3);
//     expect(endState['todolistId1'][2].title).toBe('Redux');
// });


// // Todolist
// test('new property with new array should be added when new todolsit is added', () => {
//     const startState: TasksStateType = {
//         'todolistId1': [
//             { id: '1', title: 'HTML', isDone: true },
//             { id: '2', title: 'CSS', isDone: true },
//             { id: '3', title: 'React', isDone: false },
//         ],
//         'todolistId2': [
//             { id: '1', title: 'HTML', isDone: true },
//             { id: '2', title: 'CSS', isDone: true },
//             { id: '3', title: 'React', isDone: false },
//         ],
//     }

//     const endState = taskReducer(startState, addTodolistAC('new todolist'));

//     const keys = Object.keys(endState);
//     const newKey = keys.find(k => k !== 'todolistId1' && k !== 'todolistId2');
//     if (!newKey) {
//         throw Error('new key should be added');
//     }

//     expect(keys.length).toBe(3);
//     expect(endState[newKey]).toEqual([])
// })

test('task should be added for todolist', () => {
    const action = setTasks('todolistId1', startState['todolistId1']);

    const endState = taskReducer({
        'todolistId2': [],
        'todolistId1': [],
    }, action);

    expect(endState['todolistId1'].length).toBe(3);
    expect(endState['todolistId2'].length).toBe(0);
});