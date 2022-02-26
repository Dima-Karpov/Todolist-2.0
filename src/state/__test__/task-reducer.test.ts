import { TaskPriorities, TaskStatuses } from "../../dal/todolists-api";
import {taskReducer, TasksStateType, setTasks, removeTask, addNewTask, updateCurrentTask } from "../reducers/task-reducer";
import {addNewTodolist, killTodolist, setTodolists} from './../reducers/todolist-reducer';


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

test('correct task should be deleted from correct array', () => {
    const action = removeTask({todolistId: 'todolistId2', id: '2'});

    const endState = taskReducer(startState, action);

    expect(endState['todolistId1'].length).toBe(3);
    expect(endState['todolistId2'].length).toBe(2);
    expect(endState['todolistId2'].every(task => task.id != '2')).toBeTruthy();
});

test('correct task should be added to correct array', () => {
    const action = addNewTask({task: {
        todoListId: 'todolistId2',
        title: 'newTask',
        status: TaskStatuses.New,
        addedDate: '',
        deadline: '',
        description: '',
        order: 0,
        priority: 0,
        startDate: '',
        id: 'id exists'
    }});
    const endState = taskReducer(startState, action);

    expect(endState['todolistId1'].length).toBe(3);
    expect(endState['todolistId2'].length).toBe(4);
    expect(endState['todolistId2'][0].id).toBeDefined();
    expect(endState['todolistId2'][0].title).toBe('newTask');
    expect(endState['todolistId2'][0].status).toBe(TaskStatuses.New);
});

test('status of specified task should be changed', () => {
    const action = updateCurrentTask({todolistId: 'todolistId2', id: '2', model: {status: TaskStatuses.Draft}});

    const endState = taskReducer(startState, action);
    
    expect(endState['todolistId1'][1].status).toBe(TaskStatuses.New);
    expect(endState['todolistId2'][1].status).toBe(TaskStatuses.Draft);
});

test('title of specified task should be chaged', () => {
    const action = updateCurrentTask({todolistId: 'todolistId2', id: '2', model: {title: 'newName'}});
    
    const endState = taskReducer(startState, action);
    
    expect(endState['todolistId1'][1].title).toBe('JS');
    expect(endState['todolistId2'][1].title).toBe('newName');
    expect(endState['todolistId2'][0].title).toBe('bread');
});

test('new array should be added when new todolist is added', () => {
    const action = addNewTodolist({todolist: {
        id: 'todolistId3',
        title: 'Todolist 3',
        order: 0,
        addedDate: '',
    }});

    const endState = taskReducer(startState, action);

    const keys = Object.keys(endState)
    const newKey = keys.find(k => k != 'todolistId1' && k != 'todolistId2');
    if(!newKey){
        throw Error('new key should be added')
    }

    expect(keys.length).toBe(3);
    expect(endState[newKey]).toEqual([]);
});

test('propertry with todolistId should be deleted', () => {
    const action = killTodolist({id: 'todolistId2'});
    
    const endState = taskReducer(startState, action);

    const keys = Object.keys(endState);

    expect(keys.length).toBe(1);
    expect(endState['todolistId2']).not.toBeDefined();
});

test('task should be added for todolist', () => {
    const action = setTasks({todolistId: 'todolistId1', tasks: startState['todolistId1']});

    const endState = taskReducer({
        'todolistId2': [],
        'todolistId1': [],
    }, action);

    expect(endState['todolistId1'].length).toBe(3);
    expect(endState['todolistId2'].length).toBe(0);
});

test('empty arrays should be added when we set todolists', () => {
    const action = setTodolists({todolists: [
        {id: '1', title: 'title 1', order: 0, addedDate: ''},
        {id: '2', title: 'title 2', order: 0, addedDate: ''},
    ]});

    const endState = taskReducer({}, action);

    const keys = Object.keys(endState);

    expect(keys.length).toBe(2);
    expect(endState['1']).toBeDefined();
    expect(endState['2']).toBeDefined();
});