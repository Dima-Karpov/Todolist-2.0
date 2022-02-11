import {v1} from "uuid";
import {RequestStatusType} from "../../dal/todolists-api";
import {todolistReducer, TodolistDomainType} from "../reducers/todolist-reducer";
import { changeTodolistEntityStatus } from '../reducers/todolist-reducer';


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
})



test('correct entity satus of todolist should be changed', () => {
    const newEntityStatus: RequestStatusType = 'loading';
    const action = changeTodolistEntityStatus(todolistId1, newEntityStatus)
    const endState = todolistReducer(startState, action);

    expect(endState[0].entityStatus).toBe('loading');
    expect(endState[1].entityStatus).toBe('idle');
});