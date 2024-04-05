type allData = {
    activeuuid:string,
    singedata:Array<singedata>
}

type singedata = {
    uuid:string,
    chatdata:Array<chat>
}

type chat = {
    datetime:string,
    isuser:boolean,
    text:string,
}
export type {allData,singedata,chat}