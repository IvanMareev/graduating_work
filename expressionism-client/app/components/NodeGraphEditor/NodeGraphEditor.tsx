import { apiActions } from "@/app/api/actions";
import { fetcherGet } from "@/app/api/fetchers";
import { Generator } from "@/app/types/model";
import { nanoid } from "nanoid/non-secure";
import { ContextMenu } from "primereact/contextmenu";
import {
    Dispatch,
    forwardRef,
    SetStateAction,
    useCallback,
    useEffect,
    useImperativeHandle,
    useMemo,
    useRef,
    useState,
} from "react";
import ReactFlow, {
    addEdge,
    Background,
    BackgroundVariant,
    Connection,
    Controls,
    Edge,
    getConnectedEdges,
    getOutgoers,
    Node,
    NodeChange,
    ReactFlowInstance,
    ReactFlowJsonObject,
    ReactFlowProvider,
    reconnectEdge,
    useEdgesState,
    useNodesState,
    useReactFlow,
    XYPosition,
} from "reactflow";
import useSWR from "swr";
import { nodeGroups, nodeTypes } from "./nodes";
import { IGNORE_NODES, NodeInfo } from "./nodes/types";

const getInitialNodes = () => {
    return [
        { id: nanoid(), type: "result", position: { x: 0, y: 0 }, data: { taskType: "решить" } },
    ];
};

const initialEdges: Edge[] = [];

type NodeGraphEditorProps = {
    generatorId: number;
};

export type NodeGraphRef = {
    save: () => Promise<void>;
};

function createNode(type: string, data: object, nodePosition: XYPosition) {
    return {
        id: nanoid(),
        type,
        position: nodePosition,
        data,
    };
}

function getPaneContextItems(
    contextPanePosition: XYPosition,
    setNodes: Dispatch<SetStateAction<Node<any, string | undefined>[]>>,
) {
    const nodeTypesKeys = Object.keys(nodeTypes);
    return nodeGroups.map((group) => {
        const groupItems = nodeTypesKeys
            .filter((key) => {
                const nodeGroup = nodeTypes[key as keyof typeof nodeTypes].group;
                return nodeGroup === group && nodeGroup !== IGNORE_NODES;
            })
            .map((key) => {
                const node: NodeInfo = nodeTypes[key as keyof typeof nodeTypes];
                return {
                    label: node.label,
                    command: () => {
                        const newNode: Node = createNode(key, node.data || {}, contextPanePosition);
                        setNodes((nds) => nds.concat(newNode));
                    },
                };
            });
        return { label: group, items: groupItems };
    });
}

const NodeGraphEditorInner = forwardRef((props: NodeGraphEditorProps, ref) => {
    const { data, mutate } = useSWR<Generator>("generators/" + props.generatorId, fetcherGet, {
        revalidateOnFocus: false,
    });

    const edgeUpdateSuccessful = useRef(true);
    const paneContextMenu = useRef<ContextMenu>(null);
    const nodeContextMenu = useRef<ContextMenu>(null);

    const { screenToFlowPosition, setViewport, getNode, getNodes, getEdges } = useReactFlow();
    const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [contextNode, setContextNode] = useState<Node | null>(null);
    const [contextPanePosition, setContextPanePosition] = useState<XYPosition>({ x: 0, y: 0 });

    const paneContextItems = useMemo(
        () => getPaneContextItems(contextPanePosition, setNodes),
        [contextPanePosition, setNodes],
    );

    const nodeContextItems = [
        {
            label: "Дублировать",
            command: () => {
                if (contextNode == null) {
                    throw new Error("Context node is null. Something went wrong!");
                }

                const newNode: Node = {
                    id: nanoid(),
                    type: contextNode.type,
                    position: { x: contextNode.position.x + 10, y: contextNode.position.y + 10 },
                    data: { ...contextNode.data },
                };

                setNodes((nds) => nds.concat(newNode));
            },
        },
        {
            label: "Удалить",
            command: () => {
                if (contextNode == null) {
                    throw new Error("Context node is null. Something went wrong!");
                }

                const connectedEdges = getConnectedEdges([contextNode], edges);
                setEdges(edges.filter((edge) => !connectedEdges.includes(edge)));
                setNodes(nodes.filter((node) => node.id !== contextNode.id));
            },
        },
    ];

    useImperativeHandle(ref, () => {
        return {
            async save() {
                if (rfInstance == null) return;

                const flow = rfInstance.toObject();

                await apiActions.edit.generator(1, props.generatorId, {
                    content: JSON.stringify(flow),
                });

                mutate();
            },
        };
    }, [mutate, props.generatorId, rfInstance]);

    useEffect(() => {
        if (data == null) {
            return;
        }

        const flow: ReactFlowJsonObject = JSON.parse(data.content);

        if (flow) {
            const { x = 0, y = 0, zoom = 1 } = flow.viewport;
            setNodes(flow.nodes || getInitialNodes());
            setEdges(flow.edges || initialEdges);
            setViewport({ x, y, zoom });
        } else {
            setNodes(getInitialNodes());
            setEdges(initialEdges);
        }
    }, [data, setEdges, setNodes, setViewport]);

    const isValidConnection = useCallback(
        (connection) => {
            // we are using getNodes and getEdges helpers here
            // to make sure we create isValidConnection function only once
            const nodes = getNodes();
            const edges = getEdges();
            const target = nodes.find((node) => node.id === connection.target);
            const hasCycle = (node, visited = new Set()) => {
                if (visited.has(node.id)) return false;

                visited.add(node.id);

                for (const outgoer of getOutgoers(node, nodes, edges)) {
                    if (outgoer.id === connection.source) return true;
                    if (hasCycle(outgoer, visited)) return true;
                }
            };

            if (target.id === connection.source) return false;
            return !hasCycle(target);
        },
        [getNodes, getEdges],
    );

    const onConnect = useCallback(
        (params: Edge | Connection) => {
            setEdges((els) =>
                els.filter(
                    (e) => e.target !== params.target || e.targetHandle !== params.targetHandle,
                ),
            );
            setEdges((els) => addEdge(params, els));
        },
        [setEdges],
    );

    const onEdgeUpdateStart = useCallback(() => {
        edgeUpdateSuccessful.current = false;
    }, []);

    const onEdgeUpdate = useCallback(
        (oldEdge: Edge, newConnection: Connection) => {
            edgeUpdateSuccessful.current = true;
            setEdges((els) =>
                els.filter(
                    (e) =>
                        e.target !== newConnection.target ||
                        (e.targetHandle !== newConnection.targetHandle && e !== oldEdge),
                ),
            );
            setEdges((els) => reconnectEdge(oldEdge, newConnection, els));
        },
        [setEdges],
    );

    const onEdgeUpdateEnd = useCallback(
        (_: any, edge: { id: string }) => {
            if (!edgeUpdateSuccessful.current) {
                setEdges((eds) => eds.filter((e) => e.id !== edge.id));
            }

            edgeUpdateSuccessful.current = true;
        },
        [setEdges],
    );

    const onPaneClick = useCallback((event: React.MouseEvent) => {
        paneContextMenu.current?.hide(event);
        nodeContextMenu.current?.hide(event);
        setContextNode(null);
    }, []);

    const onPaneContextMenu = useCallback(
        (event: React.MouseEvent) => {
            nodeContextMenu.current?.hide(event);
            setContextNode(null);

            paneContextMenu.current?.show(event);

            setContextPanePosition(screenToFlowPosition({ x: event.clientX, y: event.clientY }));
        },
        [screenToFlowPosition],
    );

    const onNodeContextMenu = useCallback(
        (event: React.MouseEvent, node: Node) => {
            paneContextMenu.current?.hide(event);

            if (node.type != null && node.type === "result") {
                nodeContextMenu.current?.hide(event);
                return;
            }

            node.selected = true;
            setNodes(nodes);

            setNodes((nds) =>
                nds.map((n) => {
                    if (n.id === node.id) {
                        n.selected = true;
                    }

                    return n;
                }),
            );

            nodeContextMenu.current?.show(event);
            setContextNode(node);
        },
        [nodes, setNodes],
    );

    function handleNodesChange(changes: NodeChange[]) {
        const nextChanges = changes.reduce((acc, change) => {
            // if this change is supposed to remove a node we want to validate it first
            if (change.type === "remove") {
                const node = getNode(change.id);

                // if the node can be removed, keep the change, otherwise we skip the change and keep the node
                if (node?.type !== "result") {
                    return [...acc, change];
                }

                // change is skipped, node is kept
                return acc;
            }

            // all other change types are just put into the next changes arr
            return [...acc, change];
        }, [] as NodeChange[]);

        // apply the changes we kept
        onNodesChange(nextChanges);
    }

    return (
        <>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                onConnect={onConnect}
                isValidConnection={isValidConnection}
                onNodesChange={handleNodesChange}
                onEdgesChange={onEdgesChange}
                onEdgeUpdateStart={onEdgeUpdateStart}
                onEdgeUpdate={onEdgeUpdate}
                onEdgeUpdateEnd={onEdgeUpdateEnd}
                onPaneClick={onPaneClick}
                onPaneContextMenu={onPaneContextMenu}
                onNodeContextMenu={onNodeContextMenu}
                onInit={setRfInstance}
                fitView
                proOptions={{ hideAttribution: true }}
            >
                <Controls showInteractive={false} />
                <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
            </ReactFlow>
            <ContextMenu ref={paneContextMenu} model={paneContextItems} />
            <ContextMenu ref={nodeContextMenu} model={nodeContextItems} />
        </>
    );
});

NodeGraphEditorInner.displayName = "Node Graph Editor";

const NodeGraphEditor = forwardRef((props: NodeGraphEditorProps, ref) => {
    return (
        <ReactFlowProvider>
            <NodeGraphEditorInner {...props} ref={ref} />
        </ReactFlowProvider>
    );
});

NodeGraphEditor.displayName = "Node Graph Editor Wrapper";

export default NodeGraphEditor;
