import { DropdownChangeEvent } from "primereact/dropdown";
import { useEffect, useState } from "react";
import { NodeProps, useReactFlow, useUpdateNodeInternals } from "reactflow";
import { BaseNode, InputHandle } from "./NodePrimitives";
import { DropdownField } from "./fields";
import { ExpressionismNode, IGNORE_NODES } from "./types";

const taskTypes = ["решить", "неравенство"];

const ResultNode: ExpressionismNode<NodeProps> = (props: NodeProps) => {
    const { getNodes, setNodes } = useReactFlow();
    const updateNodeInternals = useUpdateNodeInternals();
    const [taskType, setTaskType] = useState(props.data.taskType);

    const handleTaskTypeChange = (e: DropdownChangeEvent) => {
        setTaskType(e.value);
        setNodes(
            getNodes().map((node) => {
                if (node.id === props.id) {
                    node.data = {
                        ...node.data,
                        taskType: e.value,
                    };
                }

                return node;
            }),
        );
    };

    useEffect(() => {
        updateNodeInternals(props.id);
    }, [props.id, taskType, updateNodeInternals]);

    return (
        <BaseNode title="Результат" {...props}>
            <InputHandle
                handleId="inp-1"
                label={taskType === "неравенство" ? "Левая часть неравенства" : "Выражение"}
            ></InputHandle>
            {taskType === "неравенство" && (
                <InputHandle
                    handleId="right-expression"
                    label="Правая часть неравенства"
                ></InputHandle>
            )}
            <InputHandle handleId="task-type" label="Вид задания" hideHandle>
                <DropdownField
                    id="3"
                    value={taskType}
                    options={taskTypes}
                    onChange={handleTaskTypeChange}
                />
            </InputHandle>
        </BaseNode>
    );
};

ResultNode.label = "Результат";
ResultNode.group = IGNORE_NODES;

export default ResultNode;
