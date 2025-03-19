import React from "react";
import SearchUser from "../../../Components/SearchUser";
import { useMyContext } from "../../../Context/MainContext";
import CardUser from "./CardUser";


export default function Contacts(props: { setIsConverse: () => void, isConverse: boolean, contactList: any[], openMessage: (value: any) => void }) {
    const { setCtlSearchUser, setAppIdSearchUser } = useMyContext();
     return (
        <div className='overflow-auto h-100 w-100'>
            <SearchUser onClose={
                (items) => {
                    if (items.length > 0) props.openMessage(items[0]);
                }}
                maxSelection={1}
                selectionKey="employee_id"
            />
            <button type="button" title="Contatos do Chat" onClick={() => {
                setAppIdSearchUser(7);
                setCtlSearchUser(true);
            }} className="btn btn-primary fa-solid fa-address-book"></button>
            {
                props.contactList.filter(item => item.yourContact == (props.isConverse ? 1 : undefined)).map((item) =>
                    <CardUser openMessage={props.openMessage} key={`contact_${item.id}`} {...item} name={item.name} yourContact={item.yourContact || 0} isSend={true} notification={item.notification} id={item.id} />
                )}
        </div>
    );
}