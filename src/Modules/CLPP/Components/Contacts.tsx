import CardUser from "./CardUser";

export default function Contacts(props:{setIsConverse:()=>void,isConverse:boolean,contactList:any[],openMessage:(value:any)=>void}) {
    return (
        <div className='overflow-auto h-100 w-100'>
            <div className="d-flex flex-row w-100 align-items-center form-switch">
                <input onClick={() => { props.setIsConverse(); }} className="form-check-input " type="checkbox" defaultChecked={props.isConverse} />
                <label className='mx-2' htmlFor="flexSwitchCheckChecked">{props.isConverse ? 'Conversas' : 'Contatos'}</label>
            </div>
            {
                props.contactList.filter(item => item.yourContact == (props.isConverse ? 1 : undefined)).map((item) => 
                <CardUser openMessage={props.openMessage} key={`contact_${item.id}`} {...item} name={item.name} yourContact={item.yourContact || 0} isSend={true} notification={item.notification} id={item.id} />
            )}
        </div>
    );
}