import React from 'react';
import { Task } from '.'
import { TaskPriorities, TaskStatuses } from '../../../../dal/todolists-api';
import {ReduxStoreProviderDecorator} from '../../../../stories/decorators/ReduxStoreProviderDecorator';

export default {
    title: 'Task Component',
    component: Task,
    decorators: [ReduxStoreProviderDecorator]
};

export const TaskBaseExample = (props: any) => {
    return <>
        <Task
            task={{
                id: '1', title: 'React\Redux', status: TaskStatuses.Completed, todoListId: '1', startDate: '',
                deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low, description: '',
            }}
            todolistId={'todolistId1'}/>
        <Task
            task={{
                id: '1', title: 'SCSS', status: TaskStatuses.Completed, todoListId: '1', startDate: '',
                deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low, description: '',
            }}
            todolistId={'todolistId2'}/>
    </>
}