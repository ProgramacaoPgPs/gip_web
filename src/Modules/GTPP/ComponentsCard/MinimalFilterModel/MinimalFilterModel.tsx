import React from 'react';

const MinimalFilterModel = ({children}: {children: React.ReactNode}) => {
    return (
        <React.Fragment>
            <div style={{background: '#fff', padding: '1rem', borderRadius: '1rem', position: 'absolute', zIndex: '1', fontSize: '10pxs', border: '1px solid #000'}}>
                {children}
            </div>
        </React.Fragment>
    );
}

export default MinimalFilterModel;