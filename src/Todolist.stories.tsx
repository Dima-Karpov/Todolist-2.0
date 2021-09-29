import React from 'react';
import { Todolist } from './Todolist'
import { store } from './state/store';
import { Provider } from 'react-redux';

export default {
    title: 'Todolist Component',
    component: Todolist,
};


export const TodolistBaseExample = (props: any) => {
    return <>
        <Provider store={store}>
            <Todolist
                todolistId={'todolistId1'}
                title={'New Todolist 1'}
                filter={'all'} />
            <Todolist
                todolistId={'todolistId2'}
                title={'New Todolist 2'}
                filter={'all'} />
        </Provider>
    </>

}