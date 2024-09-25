import React, { ReactNode } from 'react';
import './columnTaskState.css';

type ColumnPropsTaskState = {
    title: string;
    bgColor: string;
    children?: ReactNode;
}

const ColumnTaskState: React.FC<ColumnPropsTaskState> = (props) => {
    return (
        <React.Fragment>
            <div className='columnTaskState-container'>
                <h1 className={`columnTaskState-title rounded p-1 bg-${props.bgColor}`}>{props.title}</h1>
                <div className='columnTaskState-body'>
                    {props.children}
                </div>
            </div>
        </React.Fragment>
    )
}

export default ColumnTaskState;
