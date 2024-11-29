import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import StructureModal, { MessageModal } from "../Components/CustomModal";
import User from "../Class/User";
// import WebSocketGTPPClass from "../Modules/GTPP/hook/WebSocketHook";

const logo = require("../Assets/Image/peg_pese_loading.png");

interface webSocketGTPP {
  disconnect: () => void;
  getIsConnected: () => boolean;
  send: () => void;
  getResponseWebSocket: () => object | null;
  getDataResponseWebSocket: () => object | null | any[];
  getLastSentMessage: () => object | null;
}


// Definindo o tipo dos dados no contexto
interface MyMainContext {
  loading: boolean;
  setLoading: (step: boolean) => void;

  modal: boolean;
  setModal: (step: boolean) => void;

  // webSocketInstance: webSocketGTPP | any;

  newProgressBar: any;
  setNewProgressBar: any;

  reset: any;
  setResetState: React.Dispatch<React.SetStateAction<any>>; // Expondo diretamente o setter

  setMessage: (value: { text: string; type: 1 | 2 | 3 | 4 }) => void;

  setModalPage: (step: boolean) => void;

  setModalPageElement: (value: JSX.Element) => void;

  isLogged: boolean;
  setIsLogged: (step: boolean) => void;

  titleHead: { title: string; icon?: string };
  setTitleHead: (value: { title: string; icon?: string }) => void;

  userLog: User;
  setUserLog: (value: User) => void;


  contactList: User[];
}

interface Props {
  children: JSX.Element; // Tipo para o children
}

// Criar o contexto
export const MyContext = createContext<MyMainContext | undefined>(undefined);

// Componente que fornece o contexto
export function MyProvider({ children }: Props) {
  const [loading, setLoading] = useState<boolean>(false);
  const [modal, setModal] = useState<boolean>(false);
  const [modalPage, setModalPage] = useState<boolean>(false);
  const [newProgressBar, setNewProgressBar] = useState<number | string | null>(null);
  // const [webSocketInstance, setWebSocketInstance] = useState<WebSocketGTPPClass | null>(null);
  const [response, setResponse] = useState<object | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const [message, setMessage] = useState<{ text: string; type: 1 | 2 | 3 | 4 }>({
    text: "",
    type: 1,
  });
  const [modalPageElement, setModalPageElement] = useState<JSX.Element>(<div></div>);
  const [isLogged, setIsLogged] = useState<boolean>(!false);
  const [titleHead, setTitleHead] = useState<{ title: string; icon?: string }>({
    title: "Gestão Integrada Peg Pese - GIPP",
    icon: "",
  });
  const [userLog, setUserLog] = useState<User>(
    new User({ id: 0, session: "", administrator: 0 })
  );
  const [contactList, setContactList] = useState<User[]>([]);
  const [reset, setResetState] = useState<any>(1); 

  useEffect(() => {
    if (userLog.id > 0 && isLogged) {

      // let ws = new WebSocketGTPPClass();
      // setWebSocketInstance(ws);

      // Atualiza o status da conexão
      // const checkConnection = setInterval(() => {
      //   if (ws.getIsConnected()) {
      //     setIsConnected(true);
      //     clearInterval(checkConnection);
      //   }
      // }, 100);

      // return () => {
      //   ws.disconnect();
      // }
    }

  }, [userLog, isLogged]);



  return (
    <MyContext.Provider
      value={{
        loading,
        setLoading,
        modal,
        setModal,
        setMessage,
        isLogged,
        setIsLogged,
        titleHead,
        setTitleHead,
        userLog,
        setUserLog,
        contactList,
        setModalPage,
        setModalPageElement,

        newProgressBar,
        setNewProgressBar,

        // webSocketInstance,

        reset,
        setResetState,

      }}
    >
      {loading && (
        <StructureModal className="StructureModal ModalBgWhite">
          <div className="d-flex flex-column align-items-center">
            <img className="spinner-grow-img" src={logo} alt="Logo Peg Pese" />
          </div>
        </StructureModal>
      )}

      {modal && (
        <StructureModal className="StructureModal ModalBgBlack">
          <MessageModal
            message={message.text}
            type={message.type}
            onClose={() => {
              setModal(false);
            }}
          />
        </StructureModal>
      )}
      {modalPage && (
        <StructureModal className="StructureModal ModalBgBlack">
          {modalPageElement}
        </StructureModal>
      )}

      {children}
    </MyContext.Provider>
  );
}

// Hook personalizado para usar o contexto
export const useMyContext = (): MyMainContext => {
  const context = useContext(MyContext);
  if (!context) {
    throw new Error("useMyContext must be used within a MyProvider");
  }
  return context;
};
