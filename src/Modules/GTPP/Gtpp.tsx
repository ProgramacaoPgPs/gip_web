import React, { useState, useEffect } from 'react';
import { useMyContext } from '../../Context/MainContext';
import './Gtpp.css';
import NavBar from '../../Components/Navbar/NavBar';
import CardTask from './components/Card/index';
import CollapseAll from './components/CollapseAll/CollapseAll';

export default function Gtpp(): JSX.Element {
  const { setTitleHead } = useMyContext();
  const [visibleCategories, setVisibleCategories] = useState<string[]>([]); // Estado para armazenar categorias visíveis

  useEffect(() => {
    setTitleHead({ title: 'Gerenciador de Tarefas Peg Pese - GTPP', icon: 'fa fa-home' });
  }, [setTitleHead]);

  const listPath = [{ page: '/home', children: 'Home' }];

  const tasks = {
    fazer: [
      { title: "Tarefa 1", description: "Descrição da tarefa 1" },
      { title: "Tarefa 2", description: "Descrição da tarefa 2" }
    ],
    fazendo: [
      { title: "Tarefa 3", description: "Descrição da tarefa 3" }
    ],
    analise: [
      { title: "Tarefa 4", description: "Descrição da tarefa 4" }
    ],
    parado: [
      { title: "Tarefa 5", description: "Descrição da tarefa 5" }
    ],
    concluido: [
      { title: "Tarefa 6", description: "Descrição da tarefa 6" }
    ],
    cancelados: [
      { title: "Tarefa 7", description: "Descrição da tarefa 7" }
    ]
  };

  // Função para lidar com mudança no checkbox
  const handleCheckboxChange = (category: string) => {
    setVisibleCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) // Remove categoria se já estiver visível
        : [...prev, category] // Adiciona categoria se não estiver visível
    );
  };

  return (
    <div id='moduleCLPP' className='p-2 h-100 w-100'>
      <section className='d-flex'>
        <header id="headerGipp" className='menu-link'>
          <NavBar list={listPath} />
        </header>
        <section className='w-100 h-100'>
          <div>
            {/* Checkboxes para selecionar as categorias */}
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

            {/* Renderização condicional dos cards com base nas categorias visíveis */}
            <div className='d-flex gap-5 mt-3 justify-content-start'>
              {Object.entries(tasks).map(([status, taskList], index) => (
                !visibleCategories.includes(status) && (
                  <div className="task-column" key={index}>
                    <h3>{status.toUpperCase()}</h3>
                    {taskList.map((task, idx) => (
                      <CardTask key={idx} title={task.title} description={task.description} />
                    ))}
                  </div>
                )
              ))}
            </div>
          </div>
        </section>
      </section>
    </div>
  );
}
