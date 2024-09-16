import React from "react";

type Card = {
    title?: string;
    description?: string;
}

const Card: React.FC<Card> = (props) => {
    return (
        <React.Fragment>
            <div className="card mb-3">
            <div className="row no-gutters">
                <div className="col-md-8">
                <div className="card-body">
                    <h5 className="card-title">{props.title}</h5>
                    <p className="card-text">{props.description}</p>
                </div>
                </div>
            </div>
            </div>
        </React.Fragment>
    );
}


export default Card;