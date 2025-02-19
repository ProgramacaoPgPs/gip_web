import React, { HTMLAttributes, useState } from 'react';
import './columnTaskState.css';
import ModalGenderTeste from '../Modal/ModalTeste';
import ContentFilter from '../ContentFilter/ContentFilter';
import MinimalFilterModel from '../MinimalFilterModel/MinimalFilterModel';

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
    const [filterHandler, setFilterHandler] = useState(false);

    const handleFilterForContentBody = () => {
        setFilterHandler(!filterHandler);
    }

    return (
        <div style={{ display:"flex",flexDirection:"column",height: '100%', marginLeft: '1rem' }} {...rest}>
            <div className={`columnTaskState-title  rounded-top d-flex ${props.buttonHeader ? 'justify-content-between' : 'justify-content-center'} align-items-center`} style={{ background: `#${props.bg_color}` }}>
                <div className='d-flex justify-content-between align-items-center w-100'>
                    <div><h1 className="rounded p-1">{props.title}</h1></div>
                    <div>
                        <button onClick={handleFilterForContentBody} className="btn font-filter-button">filtro</button>
                    </div>
                    <div style={{position: 'relative'}}>      
                        {filterHandler && (
                            <MinimalFilterModel>
                                <ContentFilter />
                            </MinimalFilterModel>
                        )}
                    </div>
                </div>
            </div>
            <div className="columnTaskState-container">
                <div className="columnTaskState-body">
                    {props.content_body}
                </div>
            </div>
            <div className={`columnTaskState-title rounded-bottom d-flex ${props.buttonHeader ? 'justify-content-between' : 'justify-content-center'} align-items-center justify-content-around`} style={{ background: `#${props.bg_color}` }}>
                <i className='fa save cursor-pointer text-white fa-file-csv' onClick={exportCsv} />
                <i className='fa file cursor-pointer text-white fa-file-pdf' onClick={exportPdf} />
                {is_first_column && <i className='fa add cursor-pointer text-white fa-circle-plus' onClick={addTask} />}
            </div>
        </div>
    );
};

export default ColumnTaskState;
