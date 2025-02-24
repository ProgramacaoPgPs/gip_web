import { useEffect, useState } from "react";
import SearchUser from "../../../Components/SearchUser";
import { useMyContext } from "../../../Context/MainContext";
import CardUser from "./CardUser";
import { tItemTable } from "../../../types/types";
import User from "../../../Class/User";

export default function Contacts(props: { setIsConverse: () => void, isConverse: boolean, contactList: any[], openMessage: (value: any) => void }) {
    const { setCtlSearchUser, setAppIdSearchUser } = useMyContext();
    const [contacts, setContact] = useState<tItemTable[]>([]);

    // function convertForTable(array: User[]): tItemTable[] {
    //     return array.map(element => ({
    //         employee_id: maskUserSeach(element.id.toString(), "", false, true),
    //         employee_photo: maskUserSeach(element.photo, "#", true),
    //         employee_name: maskUserSeach(element.name || '', "Nome", false, false, "150px"),
    //         company_name: maskUserSeach(element.company || '', "Comp.", false, false, "150px"),
    //         store_name: maskUserSeach(element.shop, "Loja", false, false, "150px"),
    //         departament_name: maskUserSeach(element.departament, "Depto", false, false, "150px"),
    //         sub_dep_name: maskUserSeach(element.sub, "Cargo", false, false, "150px"),
    //     }));
    // }

    // function maskUserSeach(value: string, tag: string, isImage?: boolean, ocultColumn?: boolean, minWidth?: string): {
    //     tag: string;
    //     value: string,
    //     isImage?: boolean;
    //     ocultColumn?: boolean;
    //     minWidth?: string;
    // } {
    //     return {
    //         tag,
    //         value,
    //         isImage,
    //         ocultColumn,
    //         minWidth
    //     };
    // }

    // useEffect(() => {
    //     const myContact = convertForTable(props.contactList.filter(item => item.yourContact == 1));
    //     setContact(myContact);
    // }, [props.contactList]);
    // useEffect(() => {
    //     console.log(contacts);
    // }, [contacts]);

    return (
        <div className='overflow-auto h-100 w-100'>
            <SearchUser onClose={
                (items) => {
                    if (items.length > 0) props.openMessage(items[0]);
                }}
                maxSelection={1}
                // selectionList={contacts}
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