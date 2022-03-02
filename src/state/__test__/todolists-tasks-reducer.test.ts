import {TodolistType} from "../../dal/todolists-api";
import {TasksStateType, taskReducer} from "../reducers/task-reducer";
import {addTodolist, TodolistDomainType, todolistReducer} from "../reducers/todolist-reducer";

test('ids should be equals', () => {
  const startTasksState: TasksStateType = {};
  const startTodolistsState: TodolistDomainType[] = [];

  let todolist: TodolistType = {
    title: 'New Todolist',
    id: 'any id',
    addedDate: '',
    order: 0
  };

  const action = addTodolist.fulfilled({todolist}, 'requestId', {title: 'New Todolist'});

  const endTasksState = taskReducer(startTasksState, action);
  const endTodolistState = todolistReducer(startTodolistsState, action);

  const keys = Object.keys(endTasksState);
  const idFromTasks = keys[0];
  const idFromTodolists = endTodolistState[0].id;

  expect(idFromTasks).toBe(action.payload.todolist.id);
  expect(idFromTodolists).toBe(action.payload.todolist.id)
  
});