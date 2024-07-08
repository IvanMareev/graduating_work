import { NodeProps } from "reactflow";
import { BaseNode, InputHandle, OutputHandle } from "./NodePrimitives";

const SimplificationNode = (props: NodeProps) => {
    return (
        <BaseNode title="Упрощение" color="violet" {...props}>
            <OutputHandle handleId="out-1" label="Результат"></OutputHandle>
            <InputHandle handleId="expression" label="Выражение"></InputHandle>
        </BaseNode>
    );
};

export default SimplificationNode;
