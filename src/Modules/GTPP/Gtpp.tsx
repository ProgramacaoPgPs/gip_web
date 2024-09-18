import React, { useState, useEffect } from 'react';
import { useMyContext } from '../../Context/MainContext';
import './Gtpp.css';
import NavBar from '../../Components/NavBar';
import CardTask from './components/Card/index';
import CollapseAll from './components/CollapseAll/CollapseAll';
import { Container, Row, Col } from 'react-bootstrap';
import { listPath, tasks } from '../mock/mockTeste';

export default function Gtpp(): JSX.Element {
  const { setTitleHead } = useMyContext();
  const [visibleCategories, setVisibleCategories] = useState<string[]>([]);

  useEffect(() => {
    setTitleHead({ title: 'Gerenciador de Tarefas Peg Pese - GTPP', icon: 'fa fa-home' });
  }, [setTitleHead]);

  const handleCheckboxChange = (category: string) => {
    setVisibleCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  return (
    <div id='moduleGTPP' className='h-100 w-100'>
      <Container fluid className='h-100'>
        <Row className='h-100'>
          <Col xs={12} md={2} className='menu-gtpp'>
            <header id="headerGipp" className='menu-link'>
              <NavBar list={listPath} />
            </header>
          </Col>
          <Col xs={12} md={10} className='menu-task pt-3'>
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

            <div className='tasks-container mt-3'>
              <div className='d-flex gap-5 overflow-auto'>
                {Object.entries(tasks).map(([status, taskList], index) => (
                  !visibleCategories.includes(status) && (
                    <div className="task-column" key={index}>
                      <h3>{status.toUpperCase()}</h3>
                      {taskList.map((task, idx) => (
                        <CardTask key={idx} title={task.title} description={task.listItems.map((item, idx) => (
                          <div key={idx}>
                            {item.description}
                          </div>
                        ))} />
                      ))}
                    </div>
                  )
                ))}
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
