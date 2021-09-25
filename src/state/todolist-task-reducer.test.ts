import { TasksStateType, TodolistType } from "../App"
import { addTodolist, todolistReducer, removeTodolist } from "./todolist-reducer";
import { taskReducer } from "./task-reducer";


test('ids should be equals', () => {
    const startTasksState: TasksStateType = {};
    const startTodolistState: TodolistType[] = [];

    const action = addTodolist('new Todolist')
    const endTasksState = taskReducer(startTasksState, action);
    const endTodolistState = todolistReducer(startTodolistState, action);

    const keys = Object.keys(endTasksState);
    const idFromTasks = keys[0];
    const idFromTodolists = endTodolistState[0].id;

    expect(idFromTasks).toBe(action.id)
    expect(idFromTodolists).toBe(action.id)
});

test('property with todolistId should be deleted', () => {
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
    };

    const endState = taskReducer(startState, removeTodolist('todolistId2'));
    const keys = Object.keys(endState);

    expect(keys.length).toBe(1);
    expect(endState['todolistId2']).toBeUndefined();
})