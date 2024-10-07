import React from "react";

export const IGNORE_NODES = "ignore";
export const MAIN_NODES = "Основные узлы";
export const OPERATION_NODES = "Операции";
export const CONDITION_NODES = "Узлы условий";
export const FUNCTION_NODES = "Узлы функций";
export const LARGE_OPERATORS = "Крупные операторы";

export type NodesGroup =
    | typeof IGNORE_NODES
    | typeof MAIN_NODES
    | typeof OPERATION_NODES
    | typeof CONDITION_NODES
    | typeof FUNCTION_NODES
    | typeof LARGE_OPERATORS;

export type NodeInfo = {
    label: string;
    group: NodesGroup;
    data?: object;
};

export type ExpressionismNode<T> = React.FC<T> & NodeInfo;
