import { v1 } from "uuid";
import { TodolistType, FilterValuesType } from "../App";
import { todolistReducer, removeTodolist, addTodolist, changeTodolistTitle, changeTodolistFilter } from "./todolist-reducer";

test('the required todolist must leave', () => {
    const todolistId1 = v1();
    const todolistId2 = v1();

    let startState: TodolistType[] = [
        { id: todolistId1, title: 'Learn Programming', filter: 'all' },
        { id: todolistId2, title: 'Learn English', filter: 'all' },
    ];

    const endState = todolistReducer(startState, removeTodolist(todolistId2));

    expect(endState.length).toBe(1)
});
test('the required todolist must be added', () => {
    const todolistId1 = v1();
    const todolistId2 = v1();

    let startState: TodolistType[] = [
        { id: todolistId1, title: 'Learn Programming', filter: 'all' },
        { id: todolistId2, title: 'Learn English', filter: 'all' },
    ];
    const newTitle = 'I am new Todolist';

    const endState = todolistReducer(startState, addTodolist(newTitle));

    expect(endState.length).toBe(3);
    expect(endState[2].title).toBe('Learn English');
    expect(endState[0].title).toBe('I am new Todolist');
});
test('corrent todolist should change its name', () => {
    const todolistId1 = v1();
    const todolistId2 = v1();

    let startState: TodolistType[] = [
        { id: todolistId1, title: 'Learn Programming', filter: 'all' },
        { id: todolistId2, title: 'Learn English', filter: 'all' },
    ];
    const newTitle = 'I am new Todolist';

    const endState = todolistReducer(startState, changeTodolistTitle(todolistId1, newTitle));

    expect(endState.length).toBe(2);
    expect(endState[1].title).toBe('Learn English');
    expect(endState[0].title).toBe('I am new Todolist');
});
test('orrent Todolist must change his filter', () => {
    const todolistId1 = v1();
    const todolistId2 = v1();

    let startState: TodolistType[] = [
        { id: todolistId1, title: 'Learn Programming', filter: 'all' },
        { id: todolistId2, title: 'Learn English', filter: 'all' },
    ];

    const newFilter: FilterValuesType = 'active'

    const endState = todolistReducer(startState, changeTodolistFilter(todolistId1, newFilter));

    expect(endState.length).toBe(2);
    expect(endState[0].title).toBe('Learn Programming');
    expect(endState[0].filter).toBe('active');
});