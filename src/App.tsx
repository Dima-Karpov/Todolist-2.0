import React from 'react';
import './App.css';
import { Todolist } from './Todolist';

export type TasksType = {
  id: number
  title: string
  isDone: boolean
};

export const App: React.FC = React.memo(() => {

  const tasks1: TasksType[] = [
    {id: 1, title: 'HTML', isDone: true},
    {id: 2, title: 'CSS', isDone: true},
    {id: 3, title: 'React', isDone: false},
  ];
  const tasks2: TasksType[] = [
    {id: 1, title: 'Read', isDone: true},
    {id: 2, title: 'Communicate', isDone: true},
    {id: 3, title: 'Read technical literature', isDone: false},
  ];
  const tasks3: TasksType[] = [
    {id: 1, title: 'Theory', isDone: true},
    {id: 2, title: 'Practice', isDone: true},
    {id: 3, title: 'Just be a good guy', isDone: false},
  ];

  return (
    <div className="App">
      <Todolist title={'Learn Programming'} tasks={tasks1}/>
      <Todolist title={'Learn English'} tasks={tasks2}/>
      <Todolist title={'Learn to pass an interview'} tasks={tasks3}/>
    </div>
  );
});


