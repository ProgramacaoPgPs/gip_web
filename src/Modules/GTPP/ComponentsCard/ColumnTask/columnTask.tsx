import React, { HTMLAttributes } from 'react';
import './columnTaskState.css';

type ColumnPropsTaskState = HTMLAttributes<HTMLDivElement> & {
    title: string;
    bgColor: string;
    buttonIcon?: string;
    configId?: string; // Indenfificação unica de cada card.
    buttonHeader?: JSX.Element;
    contentBody?: JSX.Element;
};

type ColumnPropsTaskStateBoolean = {
    // verifica se o conteudo é o que vai ter o a classe de adição de uma nova tarefa.
    isFirstColumn?: boolean;
}

type ColumnPropsTaskStateFunction = {
    onAction?: () => void;
    onClickHandler?: () => void;
    onCsv?: () => void;
    onPdf?: () => void;
    onAdd?: () => void;
}

const ColumnTaskState: React.FC<ColumnPropsTaskState & ColumnPropsTaskStateFunction & ColumnPropsTaskStateBoolean> = (props) => {
    return (
        <div style={{ height: '100%', marginLeft: '1rem'}} {...props}>
            <div className={`columnTaskState-title rounded-top d-flex ${props.configId} ${props.buttonHeader ? 'justify-content-between' : 'justify-content-center'} align-items-center`} style={{ background: `#${props.bgColor}` }}>
                <h1 className="rounded p-1">{props.title}</h1>
                {props.buttonHeader}
            </div>
            <div className="columnTaskState-container">
                <div className="columnTaskState-body">
                    {props.contentBody}
                </div>
            </div>
            <div className={`columnTaskState-title rounded-bottom d-flex ${props.buttonHeader ? 'justify-content-between' : 'justify-content-center'} align-items-center justify-content-around`} style={{ background: `#${props.bgColor}` }}>
                <i className='fa save cursor-pointer text-white fa-file-csv' onClick={props.onCsv}/>
                <i className='fa file cursor-pointer text-white fa-file-pdf' onClick={props.onPdf}/>
                { props.isFirstColumn && <i className='fa add cursor-pointer text-white fa-file-circle-plus' onClick={props.onAdd}/>}
            </div>
        </div>
    );
};

export default ColumnTaskState;
