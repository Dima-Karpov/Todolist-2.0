import axios from 'axios';
import React, {useEffect, useState} from 'react';

export default {
    title: 'API',
};

const settings = {
    withCredentials: true,
    headers: {
        'API-KEY': '9e8978ae-0246-4c6d-84c4-bc28bfa5ba72',
    },
}

export const GetTodolists = () => {
    const [state, setState] = useState<any>(null);

    useEffect(() => {

        axios.get<TodolistType[]>('https://social-network.samuraijs.com/api/1.1/todo-lists', settings)

        .then(res => {
            setState(res.data)
        })
        .catch(e => alert(e))

    }, []);

    return <div>{JSON.stringify(state)}</div>

};
export const CreateTodolist = () => {
    const [state, setState] = useState<any>(null);
    const [title, setTitle] = useState<string>('');

    const addTodolist = () => {
        axios.post('https://social-network.samuraijs.com/api/1.1/todo-lists', {title}, settings)
            .then(res => {
                setState(res.data)
            })
            .catch(e => alert(e)) 
    };

    // useEffect(() => {
    //     axios.post('https://social-network.samuraijs.com/api/1.1/todo-lists', {title: 'title'}, settings)
    //         .then(res => {
    //             setState(res.data)
    //         })
    //         .catch(e => alert(e)) 
    // });

    return <div>
        <div>
            <input placeholder='name -> Todolist' value={title} onChange={e => {setTitle(e.currentTarget.value)}}/>
            <button onClick={addTodolist}>Add Todolist</button>
        </div>
        {JSON.stringify(state)}
    </div>

};
export const DeletTodolist = () => {
    const [state, setState] = useState<any>(null);

    useEffect(() => {

    }, []);

    return <div>{JSON.stringify(state)}</div>

};
export const UpdateTodolistTitle = () => {
    const [state, setState] = useState<any>(null);
    const [title, setTitle] = useState<string>('')

    const addTodolist = () => {

    }

    return <div>{JSON.stringify(state)}
        <div>
            <input placeholder='title' value={title} onChange={e => {setTitle(e.currentTarget.value)}}/>
        </div>
    </div>

};

export type TodolistType = {
    addedDate: string
    id: string
    order: number
    title: string
}