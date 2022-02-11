import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { todolistApi, UpdateTaskModelType } from '../../dal/todolists-api';

export default {
    title: 'API',
};

export const GetTodolists = () => {
    const [state, setState] = useState<any>(null);

    useEffect(() => {
        todolistApi.getTodo()
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
        todolistApi.createTodo(title)
            .then((res: any) => {
                setState(res.data)
                alert(`You have created a new todolist with the title: ${title} .`)
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
            <input placeholder='title' value={title} onChange={e => { setTitle(e.currentTarget.value) }} />
            <button onClick={addTodolist}>Add Todolist</button>
        </div>
        {JSON.stringify(state)}
    </div>

};
export const DeletTodolist = () => {
    const [state, setState] = useState<any>(null);
    const [stateTodolist, setStateTodolist] = useState<string[]>([]);
    const [todolistId, setTodolistId] = useState<string>('');

    const getAllTodolistID = () => {
        todolistApi.getTodo()
            .then(res => {
                setStateTodolist(res.data.map(t => t.id))
            })
            .catch(e => alert(e))
    };

    const deletTodolist = () => {
        todolistApi.deletTodo(todolistId)
            .then(res => {
                setState(res.data)
                alert(`Todolist from id - ${todolistId} delet.`)
            })
            .catch((e) => alert(e))
    };

    return (
        <div>
            <input placeholder='id Todolist' value={todolistId} onChange={e => setTodolistId(e.currentTarget.value)} />
            <button onClick={deletTodolist}>Delet</button>
            <div>
                <div>Request all Todolist ID</div>
                <button onClick={getAllTodolistID}>Get All Todolist ID</button>
                <div> all Todolist Id: {JSON.stringify(stateTodolist)}</div>
            </div>
            <hr />
            Answer: {JSON.stringify(state)}
        </div>
    )

};
export const UpdateTodolistTitle = () => {
    const [state, setState] = useState<any>(null);
    const [stateTodolist, setStateTodolist] = useState<string[]>([]);
    const [todolistId, setTodolistId] = useState<string>('');
    const [title, setTitle] = useState<string>('');

    const getAllTodolistID = () => {
        todolistApi.getTodo()
            .then(res => {
                setStateTodolist(res.data.map(t => t.id))
            })
            .catch(e => alert(e))
    };
    const updateTodolistTitle = () => {
        todolistApi.updateTodo(todolistId, title)
            .then(res => {
                setState(res.data)
                alert(`Todolist from id - ${todolistId} update title on - ${title} .`)
            })
            .catch((e) => alert(e))
    };

    return (
        <div>
            <div>
                <input placeholder='todolist id' value={todolistId} onChange={e => { setTodolistId(e.currentTarget.value) }} />
                <input placeholder='new title' value={title} onChange={e => { setTitle(e.currentTarget.value) }} />
                <button onClick={updateTodolistTitle}>Update</button>
            </div>
            <div>
                <div>Request all Todolist ID</div>
                <button onClick={getAllTodolistID}>Get All Todolist ID</button>
                <div> all Todolist Id: {JSON.stringify(stateTodolist)}</div>
            </div>
            <hr />
            Answer: {JSON.stringify(state)}
        </div>
    )
};

export const GetTasks = () => {
    const [stateTodolist, setStateTodolist] = useState<string[]>([]);
    const [stateTasks, setStateTasks] = useState<any>(null);
    const [todolistId, setTodolistId] = useState<string>('');

    const getAllTodolistID = () => {
        todolistApi.getTodo()
            .then(res => {
                setStateTodolist(res.data.map(t => t.id));
            })
            .catch(e => alert(e))
    };

    const getTasks = () => {
        todolistApi.getTasks(todolistId)
            .then(res => {
                setStateTasks(res.data);
                alert(`Tasks received`);
            })
            .catch(e => alert(e))
    };

    return (
        <div>
            <div>
                <input placeholder='todolist id' value={todolistId} onChange={e => { setTodolistId(e.currentTarget.value) }} />
                <button onClick={getTasks}>Get tasks</button>
                <hr />
                <button onClick={getAllTodolistID}>Get todolist ID</button>
                <div> all Todolist Id: {JSON.stringify(stateTodolist)}</div>
            </div>

            <hr />
            Answer: {JSON.stringify(stateTasks)}
        </div>
    )
};

// after 179 => ['id1', 'id2'] => 'id1, id2' через map в return <div>{todolist.id}</div>

export const AddTask = () => {
    const [stateTodolist, setStateTodolist] = useState<string[]>([]);
    const [stateTasks, setStateTasks] = useState<any>(null);
    const [todolistId, setTodolistId] = useState<string>('');
    const [title, setTitle] = useState<string>('');

    const getAllTodolistID = () => {
        todolistApi.getTodo()
            .then(res => {
                setStateTodolist(res.data.map(t => t.id));
            })
            .catch(e => alert(e))
    };

    const createTask = () => {
        todolistApi.addTask(todolistId, title)
            .then((res: any) => {
                setStateTasks(res.data);
                alert(`Tasks was born on title: ${title}`);
            })
            .catch(e => alert(e))
    };

    return (
        <div>
            <div>
                <input placeholder='todolist id' value={todolistId} onChange={e => { setTodolistId(e.currentTarget.value) }} />
                <input placeholder='title' value={title} onChange={e => { setTitle(e.currentTarget.value) }} />
                <button onClick={createTask}>Add task</button>
                <hr />
                <button onClick={getAllTodolistID}>Get todolist ID</button>
                <div> all Todolist Id: {JSON.stringify(stateTodolist)}</div>
            </div>

            <hr />
            Answer: {JSON.stringify(stateTasks)}
        </div>
    )
};
export const DeleteTask = () => {
    const [stateTodolist, setStateTodolist] = useState<string[]>([]);
    const [stateTasks, setStateTasks] = useState<any>(null);
    const [todolistId, setTodolistId] = useState<string>('');
    const [taskId, setTaskId] = useState<string>('');

    const getAllTodolistID = () => {
        todolistApi.getTodo()
            .then(res => {
                setStateTodolist(res.data.map(t => t.id));
            })
            .catch(e => alert(e))
    };
    const getTasks = () => {
        todolistApi.getTasks(todolistId)
            .then(res => {
                setStateTasks(res.data);
                alert(`Tasks received`);
            })
            .catch(e => alert(e))
    };

    const deleteTask = () => {
        todolistApi.deletTask(todolistId, taskId)
            .then(res => {
                setStateTasks(res.data);
                alert(`Tasks deleted on Id: ${taskId}`);
            })
            .catch(e => alert(e))
    };

    return (
        <div>
            <div>
                <input placeholder='todolist id' value={todolistId} onChange={e => { setTodolistId(e.currentTarget.value) }} />
                <input placeholder='task id' value={taskId} onChange={e => { setTaskId(e.currentTarget.value) }} />
                <button onClick={deleteTask}>Delet task</button>

                <hr />
                <button onClick={getAllTodolistID}>Get todolist ID</button>
                <div> all Todolist Id: {JSON.stringify(stateTodolist)}</div>

                <hr />
                <input placeholder='todolist id' value={todolistId} onChange={e => { setTodolistId(e.currentTarget.value) }} />
                <button onClick={getTasks}>Get tasks ID</button>
                <div> all  Tasks Id: {JSON.stringify(taskId)}</div>
            </div>

            <hr />
            Answer: {JSON.stringify(stateTasks)}
        </div>
    )
};

export const UpdateTask = () => {

    const [stateTodolist, setStateTodolist] = useState<string[]>([]);
    const [stateTasks, setStateTasks] = useState<any>(null);
    const [todolistId, setTodolistId] = useState<string>('');
    const [taskId, setTaskId] = useState<string>('');

    let data: UpdateTaskModelType = {
        title: 'I upDATE Taks',
        description: 'follow',
        status: 1,
        priority: 1,
        startDate: '0',
        deadline: '0',
    }

    const updatingСurrentЕask = () => {
        todolistApi.updateTask(todolistId, taskId, data)
            .then(res => {
                setStateTasks(res.data)
            })
            .catch((e) => alert(e))
    };
    const getAllTodolistID = () => {
        todolistApi.getTodo()
            .then(res => {
                setStateTodolist(res.data.map(t => t.id));
            })
            .catch(e => alert(e))
    };
    const getTasks = () => {
        todolistApi.getTasks(todolistId)
            .then(res => {
                setStateTasks(res.data);
                alert(`Tasks received`);
            })
            .catch(e => alert(e))
    };

    return (
        <div>

            <div>
                <div>
                    <input placeholder={'todolistId'} value={todolistId} onChange={(e) => { setTodolistId(e.currentTarget.value) }} />
                    <input placeholder={'taskId'} value={taskId} onChange={(e) => { setTaskId(e.currentTarget.value) }} />
                    <button onClick={updatingСurrentЕask}>Updata task</button>
                </div>

                <hr />
                <button onClick={getAllTodolistID}>Get todolist ID</button>
                <div> all Todolist Id: {JSON.stringify(stateTodolist)}</div>

                <hr />
                <input placeholder='todolist id' value={todolistId} onChange={e => { setTodolistId(e.currentTarget.value) }} />
                <button onClick={getTasks}>Get tasks ID</button>
                <div> all  Tasks Id: {JSON.stringify(taskId)}</div>

            </div>

            <hr />
            Answer: {JSON.stringify(stateTasks)}

        </div>
    )
};

