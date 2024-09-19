import './style.useCard.css';
import React, { useState } from "react";
import { Collapse, Image, Card as BootstrapCard } from "react-bootstrap";

type UsePropsCard = {
    employeeName?: string;
    employeeImage?: string;
}

const UserCard: React.FC<UsePropsCard> = (props) => {
    const [openUser, setOpenUser] = useState(false);

    return (
        <React.Fragment>
         <div className="col-12 mt-3 d-flex align-items-center justify-content-end position-relative">
            <div
                className="user-toggle-btn cursor-pointer d-block position-absolute add-user"
                onClick={() => console.log('abrindo modal de registro para usuário')}
                aria-controls="user-info"
                aria-expanded={openUser}
              >
              <div className="icon-btn fa fa-plus cursor-pointer position-absolute btn-collapse" />
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
        </React.Fragment>
    )
}

export default UserCard;