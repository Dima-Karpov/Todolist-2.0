import React from 'react';
import { action } from '@storybook/addon-actions'
import { Task } from './Task'

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
            task={{ id: '1', isDone: true, title: 'React/Redux' }}
            todolistId={'todolistId1'}
            onChangeTitleHandler={onChangeTitleCallback}
            removeTask={removeTaskCallback}
            onChangeStatusHandler={onChangeStatusCallback} />
        <Task
            task={{ id: '2', isDone: false, title: 'CSS' }}
            todolistId={'todolistId2'}
            onChangeTitleHandler={onChangeTitleCallback}
            removeTask={removeTaskCallback}
            onChangeStatusHandler={onChangeStatusCallback} />
    </>
}