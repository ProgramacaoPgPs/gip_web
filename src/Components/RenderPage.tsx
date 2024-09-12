
import React from 'react';
type Props = {
    children: JSX.Element; // Tipo para o children
}
export default function RenderPage(props:Props):JSX.Element{
    return(
      <div className="App">
        <header className="App-header py-1 d-flex flex-column align-items-center">
          <h3>Gestão Integrada Peg Pese - GIPP</h3>
        </header>
        <section className='d-flex flex-column align-items-center justify-content-center'>
          {props.children}
        </section>
        <footer>
          &#169; Peg Pese Supermercados Importação e Exportação Ltda. Desenvolvido por Hygor Bueno
        </footer>
      </div>
    );
  }