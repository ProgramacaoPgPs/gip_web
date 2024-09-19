import React from "react";
import { Button, Collapse, Card as BootstrapCard } from "react-bootstrap";

type DetailsProsCard = {
    description?: string;
    title?: string;
    children?: React.ReactNode;
    listSubCard?: string | number;
}

const CardDetails: React.FC<DetailsProsCard> = (props) => {
    const [open, setOpen] = React.useState(false);

    return (
        <React.Fragment>
          <div className="col-12 d-flex justify-content-between">
            <div>
                <b className="">{props.title || ""}</b>
            </div>
            <div>
              <Button
                variant="transparent"
                className="w-100 mb-3 fa fa-book"
                onClick={() => setOpen(!open)}
                aria-controls="task-description"
                aria-expanded={open}
              > 
              </Button>
              <Collapse in={open}>
                <BootstrapCard id="task-description">
                  <BootstrapCard.Body>
                    <ul>
                        <li>{props.listSubCard || "Lista vazia"}</li>
                    </ul>
                  </BootstrapCard.Body>
                </BootstrapCard>
              </Collapse>
            </div>
          </div>
        </React.Fragment>
    )
}

export default CardDetails;