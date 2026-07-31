import { Handle, Position } from "@xyflow/react"
export type AssetTypes={
    USD:"USD",
    BTC:"BTC",

}
export type PriceTriggerMetadata={
    asset:string,
    price:string,
}
export const PriceTrigger = ({data,isConnectable}:{
data:{
    metadata:PriceTriggerMetadata
},isConnectable:boolean
}) => {
    return     (
    <div style={{
        padding: '16px',
        border: '2px solid #999',
        borderRadius: '8px',
        backgroundColor: '#fff',
        color: '#000',
        minWidth: '150px',
        minHeight: '60px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '14px',
        fontWeight: '500'
    }}>
        <div>{data.metadata.asset}</div>
        <div>${data.metadata.price}</div>
        <Handle type='source' position={Position.Right}></Handle>
    </div>
)}