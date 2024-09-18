import React, { useState } from "react";

type CardPropsTextArea = {
    stringArea?: string;
    about?: string;
}

const CardTextArea: React.FC<CardPropsTextArea> = (props) => {
    const [open, setOpen] = useState(false);
    
    return (
        <React.Fragment>
            <div className="col-12 mt-2 overflow-auto border-dark m-auto rounded" style={{height: 50, width: '95%'}}>
                <h6>{props.about || 'Lorem ipsum dolor sit amet consectetur adipisicing elit.'} </h6>
            </div>
        </React.Fragment>
    )
}


export default CardTextArea;