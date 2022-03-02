import {v1} from "uuid";
import {RequestStatusType, TodolistType} from "../../dal/todolists-api";
import {
    todolistReducer, TodolistDomainType,
    removeTodolist, addTodolist, changeTodolistTitle,
    FilterValuesType, changeTodolistFilter, fetchTodolist
} from "../reducers/todolist-reducer";
import {changeTodolistEntityStatus} from '../reducers/todolist-reducer';


let todolistId1: string;
let todolistId2: string;
let startState: TodolistDomainType[] = [];
beforeEach(() => {
    todolistId1 = v1(),
        todolistId2 = v1(),
        startState = [
            {id: todolistId1, title: 'What ot learn', filter: 'all', entityStatus: 'idle', addedDate: '', order: 0},
            {id: todolistId2, title: 'What ot learn', filter: 'all', entityStatus: 'idle', addedDate: '', order: 0},
        ];
});

test('correct todolist shold be removed', () => {
    const endState = todolistReducer(startState, removeTodolist.fulfilled({id: todolistId1}, 'requestId', {todoListId: todolistId1}));

    expect(endState.length).toBe(1);
    expect(endState[0].id).toBe(todolistId2);
});

test('correct todolist should be added', () => {
    let todolist: TodolistType = {
        title: 'Todolist 1',
        id: 'any id',
        addedDate: '',
        order: 0
    };

    const endState = todolistReducer(startState, addTodolist.fulfilled({todolist}, 'requestId', {title: 'Todolist 1'}));

    expect(endState.length).toBe(3);
    expect(endState[0].title).toBe(todolist.title);
    expect(endState[0].filter).toBe('all');
});

test('cerrect todolist should change its name', () => {
    let newTodolistTitle = 'New Todlist';
    const action = changeTodolistTitle.fulfilled(
        {id: todolistId2, title: newTodolistTitle},
        'requestId',
        {todolistId: todolistId2, title: newTodolistTitle}
    );
    const endState = todolistReducer(startState, action);

    expect(endState[0].title).toBe('What ot learn');
    expect(endState[1].title).toBe(newTodolistTitle);
});

test('correct filter of todolist should be changed', () => {
    let newFilter: FilterValuesType = 'completed';
    const action = changeTodolistFilter({id: todolistId2, filter: newFilter});

    const endState = todolistReducer(startState, action);

    expect(endState[0].filter).toBe('all');
    expect(endState[1].filter).toBe(newFilter);
});

test('todolist shold be added', () => {
    const payload = startState
    const action = fetchTodolist.fulfilled(payload, 'requestId');

    const endState = todolistReducer([], action);

    expect(endState.length).toBe(2);
});

test('correct entity satus of todolist should be changed', () => {
    const newEntityStatus: RequestStatusType = 'loading';
    const action = changeTodolistEntityStatus({id: todolistId1, status: newEntityStatus})
    const endState = todolistReducer(startState, action);

    expect(endState[0].entityStatus).toBe('loading');
    expect(endState[1].entityStatus).toBe('idle');
});