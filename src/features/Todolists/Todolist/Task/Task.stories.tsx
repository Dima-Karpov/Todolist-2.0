import React from 'react';
import { action } from '@storybook/addon-actions'
import { Task } from '.'
import { TaskPriorities, TaskStatuses } from '../../../../dal/todolists-api';

export default {
    title: 'Task Component',
    component: Task,
};

const onChangeTitleCallback = action("Title changed");
const removeTaskCallback = action("Task remode");
const onChangeStatusCallback = action("Status remode");

export const TaskBaseExample = (props: any) => {
    return <>
        <Task
            task={{
                id: '1', title: 'React\Redux', status: TaskStatuses.Completed, todoListId: '1', startDate: '',
                deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low, description: '',
            }}
            todolistId={'todolistId1'}
            onChangeTitleHandler={onChangeTitleCallback}
            removeTask={removeTaskCallback}
            onChangeStatusHandler={onChangeStatusCallback} />
        <Task
            task={{
                id: '1', title: 'SCSS', status: TaskStatuses.Completed, todoListId: '1', startDate: '',
                deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low, description: '',
            }}
            todolistId={'todolistId2'}
            onChangeTitleHandler={onChangeTitleCallback}
            removeTask={removeTaskCallback}
            onChangeStatusHandler={onChangeStatusCallback} />
    </>
}