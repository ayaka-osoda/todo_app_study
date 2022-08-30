import { useState } from 'react';
import React from 'react';
import { createRoot } from 'react-dom/client';

import { Base, Button, List, ListWrapper, Title } from '../components';

interface Task {
  id: number;
  name: string;
  completed: boolean;
}

interface Props {
  // eslint-disable-next-line react/no-unused-prop-types
  tasks: Task[];
}

function Tasks(props: Props) {
  const [state, setState] = useState({ ...props });

  const updateTask = (task: Task) => {
    fetch(`/tasks/${task.id}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: task.id,
        completed: !task.completed,
      }),
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

  return (
    <Base>
      <Title>Todo List</Title>
      <Button appearance='primary'>新規作成</Button>
      <ListWrapper>
        {state.tasks.map((task) => (
          <List key={task.id}>
            <Button appearance='primary' onClick={() => updateTask(task)}>
              {task.completed ? '完了' : '未完了'}
            </Button>
            <span>{task.name}</span>
          </List>
        ))}
      </ListWrapper>
      <Button appearance='secondary'>back</Button>
    </Base>
  );
}

const container = document.getElementById('resources-container');
const root = createRoot(container);
const data = JSON.parse(container.getAttribute('data'));
root.render(<Tasks {...data} />);