import React from 'react';

const MinimalFilterModel = ({children}: {children: React.ReactNode}) => {
    return (
        <React.Fragment>
            <div style={{background: '#fff', padding: '1rem', borderRadius: '1rem', position: 'absolute', zIndex: '1', width: 300, fontSize: '10pxs'}}>
                {children}
            </div>
        </React.Fragment>
    );
}

export default MinimalFilterModel;