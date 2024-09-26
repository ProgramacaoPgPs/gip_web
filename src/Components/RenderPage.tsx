
import React from 'react';
import { useMyContext } from '../Context/MainContext';

type Props = {
  children: JSX.Element; // Tipo para o children
}
export default function RenderPage(props: Props): JSX.Element {
  const { titleHead, isLogged } = useMyContext();
  return (
    <div className="App">
      <header className="App-header py-1 d-flex flex-row justify-content-center align-items-center">
        <h3 className={titleHead.icon}></h3><h3 className='mx-2'>{titleHead.title}</h3>
      </header>
      <section className='d-flex flex-column align-items-center justify-content-center'>
        {props.children}
      </section>
      {/* <footer>
        Peg Pese Supermercados Importação e Exportação Ltda. Desenvolvido por Hygor Bueno
      </footer> */}
    </div>
  );
}