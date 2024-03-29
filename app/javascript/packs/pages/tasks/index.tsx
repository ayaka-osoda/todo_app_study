import { useState } from 'react';
import React from 'react';
import { createRoot } from 'react-dom/client';

import { Base, Button, Checkbox, FrameFlex, Icon, List, ListWrapper, Title } from '../../components';

interface Task {
  id: number;
  name: string;
  completed: boolean;
  deadline: string;
}

interface Props {
  // eslint-disable-next-line react/no-unused-prop-types
  tasks: Task[];
}

function Tasks(props: Props) {
  const [state, setState] = useState({ ...props });
  const [editingTaskId, setEditingTaskId] = useState(null);

  const updateTask = (task: Task) => {
    fetch(`/tasks/${task.id}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...task }),
    })
      .then((response) => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response;
      })
      .then((response) => response.clone().json())
      .then((responseData) => {
        setState({ tasks: responseData });
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const TaskComponent = (task: Task) => {
    if (task.id === editingTaskId) {
      return <>
        <Checkbox value={task.name} checked={task.completed} onChange={() => toggleCompleteTask(task)}>
          {task.name}
        </Checkbox>
        <span>{task.deadline}</span>
        <Icon type='complete' onClick={() => setEditingTaskId(null)} />
      </>;
    } else {
      return <>
        <Checkbox value={task.name} checked={task.completed} onChange={() => toggleCompleteTask(task)}>
          {task.name}
        </Checkbox>
        <span>{task.deadline}</span>
        <Icon type='edit' onClick={() => setEditingTaskId(task.id)} />
      </>;

    }
  }

  const toggleCompleteTask = (task: Task) => {
    const newTask: Task = { ...task };
    newTask.completed = !newTask.completed;
    updateTask(newTask);
  };

  return (
    <Base>
      <Title>Todo List</Title>
      <FrameFlex>
        <Button appearance='primary'>Create New</Button>
        <ListWrapper>
          {state.tasks.map((task) => (
            <List key={task.id}>
              {TaskComponent(task)}
            </List>
          ))}
        </ListWrapper>
        <Button appearance='secondary'>back</Button>
      </FrameFlex>
    </Base>
  );
}

const container = document.getElementById('resources-container');
const root = createRoot(container);
const data = JSON.parse(container.getAttribute('data'));
root.render(<Tasks {...data} />);