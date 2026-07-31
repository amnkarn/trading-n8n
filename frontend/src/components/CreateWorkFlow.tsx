import { useState, useCallback } from 'react';
import {
    ReactFlow,
    applyNodeChanges,
    applyEdgeChanges,
    addEdge,
    useReactFlow,
    ReactFlowProvider,

    type NodeChange,
    type EdgeChange,
    type Connection,
    type Edge,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';
import { TriggerSheet } from './TriggerSheet';
import { PriceTrigger } from '@/nodes/triggers/PriceTrigger';
import { Timer } from '@/nodes/triggers/Timer';
import { ActionSheet } from './ActionSheet';

const nodeTypes = {
    "price-trigger": PriceTrigger,
    "timer": Timer
}
export type NodeKind = "price-trigger" | "timer" | "hyperliquid" | "backpack" | "lighter";

export interface NodeType {
    type: NodeKind;
    id: string;
    data: {
        kind: "action" | "trigger";
        metadata: any;
        label: string;
    };

    position: {
        x: number,
        y: number
    }
}
export type NodeMetadata = any;

function WorkflowEditor() {
    const [nodes, setNodes] = useState<NodeType[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);
    const { screenToFlowPosition } = useReactFlow();

    const [selectAction, setSelectAction] = useState<{
        position: {
            x: number,
            y: number
        },
        startingNodeId: string
    } | null>(null);


    const onNodesChange = useCallback(
        (changes: any) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot) as NodeType[]),
        [],
    );
    const onEdgesChange = useCallback(
        (changes: any) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
        [],
    );
    const onConnect = useCallback(
        (params: any) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
        [],
    );
    const onConnectEnd = useCallback(
        (event: any, connectionState: any) => {
            if (!connectionState.isValid) {
                const position = screenToFlowPosition({
                    x: event.clientX,
                    y: event.clientY
                });

                setSelectAction({
                    startingNodeId: connectionState.fromNode.id,
                    position
                });
            }
        },
        [screenToFlowPosition],
    );
    console.log("action state ", selectAction)

    return (
        <div style={{ width: '100vw', height: '100vh' }}>
            {!nodes.length && (
                <TriggerSheet
                    onSelect={(type, metadata) => {
                        setNodes([
                            ...nodes,
                            {
                                id: Math.random().toString(),
                                type,
                                data: {
                                    kind: 'trigger',
                                    label: type,
                                    metadata,

                                },

                                position: { x: 0, y: 0 },
                            },
                        ]);
                    }}
                />
            )}


            {selectAction && (
                <ActionSheet
                    onSelect={(type: any, metadata: any) => {
                        const newNodeId = Math.random().toString();
                        setNodes((nds) => [
                            ...nds,
                            {
                                id: newNodeId,
                                type,
                                data: {
                                    kind: 'action',
                                    label: type,
                                    metadata,
                                },
                                position: selectAction.position,
                            },
                        ]);
                        setEdges((eds) =>
                            addEdge(
                                {
                                    source: selectAction.startingNodeId,
                                    target: newNodeId,
                                    sourceHandle: null,
                                    targetHandle: null,
                                },
                                eds,
                            ),
                        );
                        setSelectAction(null);
                    }}
                />
            )}
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                onConnectEnd={onConnectEnd}
                fitView
            />
        </div>
    );
}

export default function CreateWorkFlow() {
    return (
        <ReactFlowProvider>
            <WorkflowEditor />
        </ReactFlowProvider>
    );
}
