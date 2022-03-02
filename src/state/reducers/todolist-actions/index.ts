import {createAsyncThunk} from "@reduxjs/toolkit";
import {todolistApi} from "../../../dal/todolists-api";
import {handleServerAppError, handleServerNetworkError} from "../../../utils/error-utils";
import {setAppStatus} from "../app-reducer";
import {tasksActions} from "../tasks-actions";
import {changeTodolistEntityStatus} from "../todolist-reducer";

export const fetchTodolist = createAsyncThunk('todolists/fetchTodolist', async (param, thunkAPI) => {
  try
  {
    thunkAPI.dispatch(setAppStatus({status: 'loading'}));
    const res = await todolistApi.getTodo();
    res.data.forEach(tl => thunkAPI.dispatch(tasksActions.fetchTasks(tl.id)));
    return res.data;
  } catch (error)
  {
    handleServerNetworkError(error, thunkAPI.dispatch);
    return thunkAPI.rejectWithValue({});
  } finally
  {
    thunkAPI.dispatch(setAppStatus({status: 'succeeded'}));
  }
});
export const removeTodolist = createAsyncThunk('todolists/removeTodolist', async (param: {todoListId: string}, thunkAPI) => {
  try
  {
    thunkAPI.dispatch(setAppStatus({status: 'loading'}));
    thunkAPI.dispatch(changeTodolistEntityStatus({id: param.todoListId, status: 'loading'}));
    await todolistApi.deletTodo(param.todoListId);
    return {id: param.todoListId};
  } catch (error)
  {
    handleServerNetworkError(error, thunkAPI.dispatch);
    return thunkAPI.rejectWithValue({});
  } finally
  {
    thunkAPI.dispatch(setAppStatus({status: 'succeeded'}));
  }
});
export const changeTodolistTitle = createAsyncThunk('todolists/changeTodolistTitle',
  async (param: {todolistId: string, title: string}, thunkAPI) => {

    thunkAPI.dispatch(setAppStatus({status: 'loading'}));
    try
    {
      const res = await todolistApi.updateTodo(param.todolistId, param.title);
      if (res.data.resultCode === 0)
      {
        return {id: param.todolistId, title: param.title};
      } else
      {
        handleServerAppError(res.data, thunkAPI.dispatch);
        return thunkAPI.rejectWithValue({});
      }
    } catch (error)
    {
      handleServerNetworkError(error, thunkAPI.dispatch);
      thunkAPI.dispatch(setAppStatus({status: 'failed'}));
      return thunkAPI.rejectWithValue({});
    } finally
    {
      thunkAPI.dispatch(setAppStatus({status: 'succeeded'}));
    }
  });
export const addTodolist = createAsyncThunk('todolists/addTodolist', async (param: {title: string}, thunkAPI) => {
  thunkAPI.dispatch(setAppStatus({status: 'loading'}));
  try
  {
    const res = await todolistApi.createTodo(param.title);
    if (res.data.resultCode === 0)
    {
      return {todolist: res.data.data.item};
    } else
    {
      handleServerAppError(res.data, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue({});
    }
  } catch (error)
  {
    handleServerNetworkError(error, thunkAPI.dispatch);
    thunkAPI.dispatch(setAppStatus({status: 'failed'}));
    return thunkAPI.rejectWithValue({});
  } finally
  {
    thunkAPI.dispatch(setAppStatus({status: 'succeeded'}));
  }
});

export const todolistsActions = {addTodolist, changeTodolistTitle, removeTodolist, fetchTodolist}