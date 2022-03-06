import {call, put} from "redux-saga/effects";
import {GetTasksResponse, TaskPriorities, TaskStatuses, todolistApi} from "../../dal/todolists-api";
import {setAppError, setAppStatus} from "../reducers/app-reducer";
import {addTaskWorkerSaga, fetchTasksWorkerSaga} from "../reducers/tasks-sagas";
import {setTasks} from "../reducers/task-reducer";


beforeEach(() => {

});


test('fetchTasksWorkerSaga success flow', () => {
    const todolistId: string = 'todolistId'
    const generator = fetchTasksWorkerSaga({type: 'TASK/FETCH-TASK', todolistId: todolistId});
    let result = generator.next();

    expect(result.value).toEqual(put(setAppStatus('loading')));

    result = generator.next();
    expect(result.value).toEqual(call(todolistApi.getTasks, todolistId))

    const fakeApiResponse: GetTasksResponse = {
        error: '',
        totalCount: 1,
        items: [{
            description: '',
            title: 'task',
            status: TaskStatuses.New,
            priority: TaskPriorities.Low,
            startDate: '',
            deadline: '',
            id: '1',
            todoListId: todolistId,
            order: 0,
            addedDate: '',
        }]
    }

    result = generator.next(fakeApiResponse)
    expect(result.value).toEqual(put(setTasks(todolistId, fakeApiResponse.items)));
    result = generator.next()
    expect(result.value).toEqual(put(setAppStatus('succeeded')));
    result = generator.next();
    expect(result.done).toBeTruthy()
})
test('addTaskWorkerSaga error flow', () => {
    const todolistId: string = 'todolistId'
    const newTask = 'newTask';
    const generator = addTaskWorkerSaga({type: 'TASK/ADD-NEW-TASK', todolistId: todolistId, title: newTask});
    expect(generator.next().value).toEqual(put(setAppStatus('loading')));

    expect(generator.next().value).toEqual(call(todolistApi.addTask, todolistId, newTask))
    expect(generator.throw({message: 'Error'}).value).toEqual(put(setAppError('Error')))
    expect(generator.next().value).toEqual( put(setAppStatus('failed')))

})





