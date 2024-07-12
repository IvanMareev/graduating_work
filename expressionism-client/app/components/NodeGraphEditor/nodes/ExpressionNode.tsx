import { NodeProps, useReactFlow } from "reactflow";
import { BaseNode, OutputHandle } from "./NodePrimitives";
import { InputField } from "./fields";
import { ExpressionismNode, MAIN_NODES } from "./types";

const ExpressionNode: ExpressionismNode<NodeProps> = (props: NodeProps) => {
    const { getNodes, setNodes } = useReactFlow();

    return (
        <BaseNode title="Выражение" color="green" {...props}>
            <OutputHandle handleId="out-1">
                <InputField
                    value={props.data?.value}
                    placeholder="Введите выражение"
                    onChange={(e) => {
                        setNodes(
                            getNodes().map((node) => {
                                if (node.id === props.id) {
                                    node.data = {
                                        ...node.data,
                                        value: e.target.value,
                                    };
                                }
                                return node;
                            }),
                        );
                    }}
                />
            </OutputHandle>
        </BaseNode>
    );
};

ExpressionNode.label = "Выражение";
ExpressionNode.group = MAIN_NODES;
ExpressionNode.data = { value: "" };

export default ExpressionNode;
