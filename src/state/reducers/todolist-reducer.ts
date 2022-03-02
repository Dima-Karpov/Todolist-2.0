import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RequestStatusType, TodolistType} from '../../dal/todolists-api';
import {AppRootStateType} from '../store';
import {todolistsActions} from './todolist-actions';


const slice = createSlice({
    name: 'todolists',
    initialState: [] as TodolistDomainType[],
    reducers: {
        changeTodolistFilter(state, action: PayloadAction<{id: string, filter: FilterValuesType}>) {
            const index = state.findIndex(todolist => todolist.id === action.payload.id)
            state[index].filter = action.payload.filter;
        },
        changeTodolistEntityStatus(state, action: PayloadAction<{id: string, status: RequestStatusType}>) {
            const index = state.findIndex(todolist => todolist.id === action.payload.id)
            state[index].entityStatus = action.payload.status;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(todolistsActions.fetchTodolist.fulfilled, (state, action) => {
            return action.payload.map(todolist => ({...todolist, filter: 'all', entityStatus: 'idle'}));
        });
        builder.addCase(todolistsActions.removeTodolist.fulfilled, (state, action) => {
            const index = state.findIndex(todolist => todolist.id === action.payload.id);
            if (index > -1) {
                state.splice(index, 1);
            }
        });
        builder.addCase(todolistsActions.addTodolist.fulfilled, (state, action) => {
            state.unshift({...action.payload.todolist, filter: 'all', entityStatus: 'idle'});
        });
        builder.addCase(todolistsActions.changeTodolistTitle.fulfilled, (state, action) => {
            const index = state.findIndex(todolist => todolist.id === action.payload.id)
            state[index].title = action.payload.title;
        });

    },
});

export const todolistReducer = slice.reducer
export const {changeTodolistFilter, changeTodolistEntityStatus} = slice.actions;

export const selectTodolsts = (state: AppRootStateType) => state.todolist;

export type FilterValuesType = 'all' | 'completed' | 'active';
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType,
    entityStatus: RequestStatusType,
};


