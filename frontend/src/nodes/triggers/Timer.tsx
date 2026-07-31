import { Handle, Position } from "@xyflow/react"

export type TimerNodeMetadata={
   time:number
}
export const Timer = ({data}:{
data:{
    metadata:TimerNodeMetadata
}
}) => {
    return (
    <div style={{
        padding: '16px',
        border: '2px solid #999',
        borderRadius: '8px',
        backgroundColor: '#fff',
        color: '#000',
        minWidth: '150px',
        minHeight: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '14px',
        fontWeight: '500'
    }}>
        Every {data.metadata.time} seconds
        <Handle type='source' position={Position.Right}></Handle>
    </div>)
}