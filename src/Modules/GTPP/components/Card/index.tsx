import './style.card.css';
import React from "react";
import { Card as BootstrapCard, Button, Collapse, Image } from 'react-bootstrap';
import HeaderCard from './headerCard/headerCard';
import CardDetails from './cardDetails/cardDetails';
import CardTextArea from './cardTextArea/cardTextArea';
import UserCard from './userCard/userCard';

type CardProps = {
  title?: string;
  color?: string;
  description?: any;
  employeeName?: string;
  employeeImage?: string;
  about?: string;
}

const Card: React.FC<CardProps> = (props) => {
  return (
    <BootstrapCard className="cardTask mb-3 shadow-lg rounded">
      <BootstrapCard.Body>
        <div className="row">
          <HeaderCard
            description={props.description || ""}
            title={props.title || ""}
            children={
              <React.Fragment>
                <Button variant="transparent" onClick={() => console.log('listando os níveis de propriedade')} className="icon-btn fa fa-flag" />
                <Button variant="transparent" onClick={() => console.log('listando os botões de download')} className="icon-btn fa fa-file" />
              </React.Fragment>
            }
          />
          <CardDetails title='teste' listSubCard={props.description} />
          <CardTextArea />
          <UserCard />
        </div>
      </BootstrapCard.Body>
    </BootstrapCard>
  );
}

export default Card;
