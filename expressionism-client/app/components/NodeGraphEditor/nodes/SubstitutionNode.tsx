import { DropdownChangeEvent } from "primereact/dropdown";
import { useState } from "react";
import { NodeProps, useStore } from "reactflow";
import { BaseNode, InputHandle, OutputHandle } from "./NodePrimitives";
import { DropdownField, InputField } from "./fields";

const substituteVariables = ["x", "y", "z", "w"];

const SubstitutionNode = (props: NodeProps) => {
    const [variable, setVariable] = useState(props.data.variable);
    const nodes = useStore((s) => s.getNodes());
    const setNodes = useStore((s) => s.setNodes);

    const handleOperatorChange = (e: DropdownChangeEvent) => {
        setVariable(e.value);
        setNodes(
            nodes.map((node) => {
                if (node.id === props.id) {
                    node.data = {
                        ...node.data,
                        variable: e.value,
                    };
                }
                return node;
            }),
        );
    };

    return (
        <BaseNode title="Подстановка" color="orange" {...props}>
            <OutputHandle handleId="out-1" label="Результат"></OutputHandle>
            <InputHandle handleId="inp-1" label="В выражение">
                <InputField id={"1"} placeholder="Введите выражение" />
            </InputHandle>
            <InputHandle handleId="inp-2" label="Вместо" hideHandle={true}>
                <DropdownField
                    value={variable}
                    options={substituteVariables}
                    onChange={handleOperatorChange}
                />
            </InputHandle>
            <InputHandle handleId="inp-3" label="Подставить">
                <InputField id={"2"} placeholder="Введите выражение" />
            </InputHandle>
        </BaseNode>
    );
};

export default SubstitutionNode;
