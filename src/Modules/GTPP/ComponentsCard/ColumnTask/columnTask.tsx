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
            <div style={{height:'100%'}}>
                <div className='columnTaskState-title' style={{background: `#${props.bgColor}`}}><h1 className={`rounded p-1`}>{props.title}</h1></div>
                <div className='columnTaskState-container'>
                    <div className='columnTaskState-body'>
                        {props.children}
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default ColumnTaskState;
