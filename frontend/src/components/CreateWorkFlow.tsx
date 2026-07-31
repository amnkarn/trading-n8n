import { useState, useCallback, useEffect } from 'react';
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
    Background,
} from '@xyflow/react';
import { Moon, Sun } from 'lucide-react';

import '@xyflow/react/dist/style.css';
import { TriggerSheet } from './TriggerSheet';
import { PriceTrigger } from '@/nodes/triggers/PriceTrigger';
import { Timer } from '@/nodes/triggers/Timer';
import { ActionSheet } from './ActionSheet';

import Lighter from '@/nodes/action/Lighter';

const nodeTypes = {
    "price-trigger": PriceTrigger,
    "timer": Timer,
    "lighter": Lighter,
    "hyperliquid": Lighter,
    "backpack": Lighter,
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
    const [theme, setTheme] = useState<"dark" | "light">(() => {
        return document.documentElement.classList.contains("dark") ? "dark" : "light";
    });
    const [isTriggerSheetOpen, setIsTriggerSheetOpen] = useState(true);

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

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

    return (
        <div className={`w-screen h-[100dvh] overflow-hidden flex flex-col transition-colors duration-300 ${theme === 'dark' ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
            {/* Top Navbar */}
            <header className="h-14 border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 backdrop-blur-md flex items-center justify-between px-6 z-10 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-md bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center font-bold text-lg shadow-lg shadow-emerald-500/20 text-white">
                        N
                    </div>
                    <span className="font-bold text-lg tracking-wide text-slate-800 dark:text-slate-100">Automations</span>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} className="p-1.5 flex items-center justify-center bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 rounded-md transition-colors text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700">
                        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                    </button>
                    <button className="px-4 py-1.5 text-sm font-medium bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 rounded-md transition-colors border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200">Test</button>
                    <button className="px-4 py-1.5 text-sm font-medium bg-indigo-500 hover:bg-indigo-600 rounded-md transition-colors shadow-lg shadow-indigo-500/20 text-white">Publish</button>
                </div>
            </header>

            {/* Canvas Area */}
            <div className={`w-full flex-grow relative ${theme === 'dark' ? 'bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]' : "bg-[url('/image.png')] bg-repeat"}`}>
                {!nodes.length && !isTriggerSheetOpen && (
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                        <button onClick={() => setIsTriggerSheetOpen(true)} className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all hover:scale-105">
                            Add Initial Trigger
                        </button>
                    </div>
                )}

                {!nodes.length && isTriggerSheetOpen && (
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
                            setIsTriggerSheetOpen(false);
                        }}
                        onClose={() => setIsTriggerSheetOpen(false)}
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
                        onClose={() => setSelectAction(null)}
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
                >
                    {theme === 'dark' && <Background color="#334155" gap={20} size={1.5} />}
                </ReactFlow>
            </div>
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
