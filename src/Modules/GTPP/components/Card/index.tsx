import './style.card.css';
import { faCirclePlus, faFileAlt, faFlag, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Card as BootstrapCard, Button, Collapse, Image } from 'react-bootstrap';

type CardProps = {
  title?: string;
  color?: string;
  description?: any;
  employeeName?: string;
  employeeImage?: string;
}

const Card: React.FC<CardProps> = (props) => {
  const [open, setOpen] = React.useState(false);
  const [openUser, setOpenUser] = React.useState(false);

  return (
    <BootstrapCard className="cardTask mb-3 shadow-lg rounded">
      <BootstrapCard.Body>
        <div className="row">
          {/* Título e Botões de Ícone */}
          <div className="col-12 d-flex justify-content-between align-items-center mb-3">
            <BootstrapCard.Title onClick={(e) => console.log('Abrindo modal grande')} title={props.title} className="card-title cursor-pointer">{props.title}</BootstrapCard.Title>
            <div className="card-icons">
              <Button variant="link" className="icon-btn">
                <FontAwesomeIcon icon={faFlag} color={props.color || "gray"} />
              </Button>
              <Button variant="link" className="icon-btn">
                <FontAwesomeIcon icon={faFileAlt} color={props.color || "gray"} />
              </Button>
            </div>
          </div>

          {/* Detalhes */}
          <div className="col-12">
            <Button
              variant="outline-success"
              className="w-100 mb-3"
              onClick={() => setOpen(!open)}
              aria-controls="task-description"
              aria-expanded={open}
            > Detalhes
            </Button>
            <Collapse in={open}>
              <div id="task-description">
                <BootstrapCard className="border-light">
                  <BootstrapCard.Body>
                    <p>{props.description}</p>
                  </BootstrapCard.Body>
                </BootstrapCard>
              </div>
            </Collapse>
          </div>

          {/* Descrição da Tarefa */}
          <div className="col-12 mt-2 overflow-auto border-dark m-auto rounded" style={{height: 50, width: '95%'}}>
            <h6>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate veritatis dicta illo voluptate eum alias nobis ullam cum quisquam. Eos distinctio temporibus provident nesciunt enim porro modi autem id voluptas!</h6>
          </div>

          {/* Botões de Usuário */}
          <div className="col-12 mt-3 d-flex align-items-center justify-content-end position-relative">
            {/* Icone de adicionar mais um usuário */}
            <div
                className="user-toggle-btn cursor-pointer d-block position-absolute add-user"
                onClick={() => console.log('abrindo modal de registro para usuário')}
                aria-controls="user-info"
                aria-expanded={openUser}
              >
              <FontAwesomeIcon 
                icon={faPlus}
                color='#000'
                fontSize={30}
              />
              <div>
                <span className="ms-2 employee-name">{props.employeeName}</span>
              </div>
            </div>
            <div
              className="user-toggle-btn cursor-pointer d-block"
              onClick={() => setOpenUser(!openUser)}
              aria-controls="user-info"
              aria-expanded={openUser}
            >
              <Image 
                src={props.employeeImage || 'https://via.placeholder.com/50'}
                roundedCircle 
                className="employee-img"
                alt={props.employeeName || 'Usuário'}
              />
              <div>
                <span className="ms-2 employee-name">{props.employeeName || 'User'}</span>
              </div>
            </div>
          </div>

          <Collapse in={openUser}>
            <div id="user-info" className="col-12 mt-2">
              <BootstrapCard className="border-dark">
                <BootstrapCard.Body className="p-1">
                  <div className="d-flex align-items-center gap-2">
                    <Image 
                      src={props.employeeImage || 'https://via.placeholder.com/50'}
                      roundedCircle 
                      className="employee-img"
                    />
                    <span className="employee-name">{props.employeeName || 'User'}</span>
                  </div>
                </BootstrapCard.Body>
              </BootstrapCard>
            </div>
          </Collapse>
        </div>
      </BootstrapCard.Body>
    </BootstrapCard>
  );
}

export default Card;
