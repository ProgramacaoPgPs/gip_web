import React from "react";

type HeaderProsCard = {
    description: string;
    title: string;
    children: React.ReactNode;
}

const HeaderCard: React.FC<HeaderProsCard> = (props) => {
    return (
        <React.Fragment>
          <div className="col-12 d-flex justify-content-between align-items-center mb-3">
            <h3 onClick={(e) => console.log(e)} title={props.title} className="card-title cursor-pointer">{props.title}</h3>
            <div className="card-icons">
              {props.children}
            </div>
          </div>
        </React.Fragment>
    )
}

export default HeaderCard;