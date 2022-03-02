import {createAsyncThunk} from "@reduxjs/toolkit";
import {todolistApi, UpdateTaskModelType} from "../../../dal/todolists-api";
import {handleServerAppError, handleServerNetworkError} from "../../../utils/error-utils";
import {AppRootStateType} from "../../store";
import {setAppStatus} from "../app-reducer";
import {UpdateDomainTaskModelType} from "../task-reducer";

const fetchTasks = createAsyncThunk('task/fethcTasks', async (todolistId: string, thunkAPI) => {
  thunkAPI.dispatch(setAppStatus({status: 'loading'}));
  try
  {
    const res = await todolistApi.getTasks(todolistId);
    const tasks = res.data.items;
    return {todolistId, tasks};
  } catch (error)
  {
    handleServerNetworkError(error, thunkAPI.dispatch);
    return thunkAPI.rejectWithValue({});
  } finally
  {
    thunkAPI.dispatch(setAppStatus({status: 'failed'}))
  }
});
const deletTask = createAsyncThunk('task/deletTask', async (param: {todolistId: string, id: string}, thunkAPI) => {
  thunkAPI.dispatch(setAppStatus({status: 'loading'}))
  try
  {
    await todolistApi.deletTask(param.todolistId, param.id);
    return {todolistId: param.todolistId, id: param.id};
  } catch (error)
  {
    handleServerNetworkError(error, thunkAPI.dispatch);
    return thunkAPI.rejectWithValue({});
  } finally
  {
    thunkAPI.dispatch(setAppStatus({status: 'failed'}))
  }

});
const addTask = createAsyncThunk('task/addTask', async (param: {todolistId: string, title: string}, thunkAPI) => {
  thunkAPI.dispatch(setAppStatus({status: 'loading'}))
  try
  {
    const res = await todolistApi.addTask(param.todolistId, param.title);
    if (res.data.resultCode === 0)
    {
      return res.data.data.item
    } else
    {
      handleServerAppError(res.data, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue({});
    }
  } catch (error)
  {
    handleServerNetworkError(error, thunkAPI.dispatch);
    return thunkAPI.rejectWithValue({});
  } finally
  {
    thunkAPI.dispatch(setAppStatus({status: 'failed'}))
  }

});
const updateTask = createAsyncThunk('task/updateTask', async (
  param: {todolistId: string, taskId: string, domainModel: UpdateDomainTaskModelType},
  thunkAPI) => {

  thunkAPI.dispatch(setAppStatus({status: 'loading'}))
  try
  {
    let state = thunkAPI.getState() as AppRootStateType;
    const task = state.tasks[param.todolistId].find(t => t.id === param.taskId);
    if (!task)
    {
      return thunkAPI.rejectWithValue('task no found in the state');
    };
    const apiModel: UpdateTaskModelType = {
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      startDate: task.startDate,
      deadline: task.deadline,
      ...param.domainModel
    };
    const res = await todolistApi.updateTask(param.todolistId, param.taskId, apiModel);
    if (res.data.resultCode === 0)
    {
      return param;
    } else
    {
      handleServerAppError(res.data, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue({});
    }
  } catch (error)
  {
    handleServerNetworkError(error, thunkAPI.dispatch);
    return thunkAPI.rejectWithValue({});
  } finally
  {
    thunkAPI.dispatch(setAppStatus({status: 'failed'}))
  }
});

export const tasksActions = {updateTask, addTask, fetchTasks, deletTask}
