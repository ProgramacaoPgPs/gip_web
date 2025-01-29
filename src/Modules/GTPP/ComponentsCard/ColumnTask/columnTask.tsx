import React, { HTMLAttributes } from 'react';
import './columnTaskState.css';

type ColumnPropsTaskState = HTMLAttributes<HTMLDivElement> & {
    title: string;
    bg_color: string;
    buttonIcon?: string;
    buttonHeader?: JSX.Element;
    content_body?: JSX.Element;
};

type ColumnPropsTaskStateBoolean = {
    is_first_column?: boolean;
}

type ColumnPropsTaskStateFunction = {
    exportCsv?: () => void;
    exportPdf?: () => void;
    addTask?: () => void;
}

const ColumnTaskState: React.FC<ColumnPropsTaskState & ColumnPropsTaskStateFunction & ColumnPropsTaskStateBoolean> = (props) => {
    const { exportCsv, exportPdf, addTask, is_first_column, ...rest } = props;

    return (
        <div style={{ display:"flex",flexDirection:"column",height: '100%', marginLeft: '1rem' }} {...rest}>
            <div className={`columnTaskState-title  rounded-top d-flex ${props.buttonHeader ? 'justify-content-between' : 'justify-content-center'} align-items-center`} style={{ background: `#${props.bg_color}` }}>
                <h1 className="rounded p-1">{props.title}</h1>
                {props.buttonHeader}
            </div>
            <div className="columnTaskState-container">
                <div className="columnTaskState-body">
                    {props.content_body}
                </div>
            </div>
            <div className={`columnTaskState-title rounded-bottom d-flex ${props.buttonHeader ? 'justify-content-between' : 'justify-content-center'} align-items-center justify-content-around`} style={{ background: `#${props.bg_color}` }}>
                <i className='fa save cursor-pointer text-white fa-file-csv' onClick={exportCsv} />
                <i className='fa file cursor-pointer text-white fa-file-pdf' onClick={exportPdf} />
                {is_first_column && <i className='fa add cursor-pointer text-white fa-file-circle-plus' onClick={addTask} />}
            </div>
        </div>
    );
};

export default ColumnTaskState;
