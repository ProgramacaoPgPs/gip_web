import React, { useState, useEffect } from 'react';
import { useMyContext } from '../../Context/MainContext';
import './Gtpp.css';
import NavBar from '../../Components/Navbar/NavBar';
import CardTask from './components/Card/index';
import CollapseAll from './components/CollapseAll/CollapseAll';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

type Task = {
  id: string;
  title: string;
  description: string;
};

type TaskMap = {
  [key: string]: Task[];
};


export default function Gtpp(): JSX.Element {
  const { setTitleHead } = useMyContext();
  const [visibleCategories, setVisibleCategories] = useState<string[]>([]);
  const [tasks, setTasks] = useState<TaskMap>({
    fazer: [
      { id: "1", title: "Tarefa 1", description: "Descrição da tarefa 1" },
      { id: "2", title: "Tarefa 2", description: "Descrição da tarefa 2" }
    ],
    fazendo: [
      { id: "3", title: "Tarefa 3", description: "Descrição da tarefa 3" }
    ],
    analise: [
      { id: "4", title: "Tarefa 4", description: "Descrição da tarefa 4" }
    ],
    parado: [
      { id: "5", title: "Tarefa 5", description: "Descrição da tarefa 5" }
    ],
    concluido: [
      { id: "6", title: "Tarefa 6", description: "Descrição da tarefa 6" }
    ],
    cancelados: [
      { id: "7", title: "Tarefa 7", description: "Descrição da tarefa 7" }
    ]
  });
  

  useEffect(() => {
    setTitleHead({ title: 'Gerenciador de Tarefas Peg Pese - GTPP', icon: 'fa fa-home' });
  }, [setTitleHead]);

  const listPath = [{ page: '/home', children: 'Home' }];

  const handleCheckboxChange = (category: string) => {
    setVisibleCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    );
  };

  const onDragEnd = (result: any) => {
    const { source, destination } = result;
  
    // Se não há destino, retorna
    if (!destination) return;
  
    // Se o item foi solto na mesma posição, retorna
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }
  
    // Atualiza as tarefas
    const sourceList = [...tasks[source.droppableId as keyof typeof tasks]];
    const destinationList = [...tasks[destination.droppableId as keyof typeof tasks]];
  
    // Remove o item da lista de origem
    const [movedTask] = sourceList.splice(source.index, 1);
    destinationList.splice(destination.index, 0, movedTask);
  
    // Atualiza o estado das tarefas
    setTasks((prevTasks) => ({
      ...prevTasks,
      [source.droppableId]: sourceList,
      [destination.droppableId]: destinationList
    }));
  };
  

  return (
    <div id='moduleCLPP' className='p-2 h-100 w-100'>
      <section className='d-flex'>
        <header id="headerGipp" className='menu-link'>
          <NavBar list={listPath} />
        </header>
        <section className='w-100 h-100'>
          <div>
            <CollapseAll toggleText='Filtrar tarefas'>
              {Object.keys(tasks).map((status) => (
                <li key={status}>
                  <input 
                    type="checkbox" 
                    id={status} 
                    checked={visibleCategories.includes(status)} 
                    onChange={() => handleCheckboxChange(status)} 
                  />
                  <label htmlFor={status} className="ms-2 cursor-pointer">{status.toUpperCase()}</label>
                </li>
              ))}
            </CollapseAll>

            <DragDropContext onDragEnd={onDragEnd}>
              <div className='d-flex gap-5 mt-3 justify-content-start'>
                {Object.entries(tasks).map(([status, taskList]) => (
                  !visibleCategories.includes(status) && (
                    <Droppable droppableId={status} key={status}>
                      {(provided) => (
                        <div
                          className="task-column"
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                        >
                          <h3>{status.toUpperCase()}</h3>
                          {taskList.map((task, idx) => (
                            <Draggable key={task.id} draggableId={task.id} index={idx}>
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  <CardTask title={task.title} description={task.description} />
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  )
                ))}
              </div>
            </DragDropContext>
          </div>
        </section>
      </section>
    </div>
  );
}
