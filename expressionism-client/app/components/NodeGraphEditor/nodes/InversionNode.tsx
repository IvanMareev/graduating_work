import { NodeProps } from "reactflow";
import { BaseNode, InputHandle, OutputHandle } from "./NodePrimitives";

const InversionNode = (props: NodeProps) => {
    return (
        <BaseNode title="Инверсия" color="violet" {...props}>
            <OutputHandle handleId="out-1" label="Результат"></OutputHandle>
            <InputHandle handleId="expression" label="Выражение"></InputHandle>
        </BaseNode>
    );
};

export default InversionNode;
