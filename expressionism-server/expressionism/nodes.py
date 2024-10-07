from __future__ import annotations
import random
from sympy import (
    Expr,
    evaluate,
    parse_expr,
    expand,
    Add,
    Mul,
    Pow,
    Limit,
    simplify,
)
from typing import TYPE_CHECKING
from icecream import ic

if TYPE_CHECKING:
    from expressionism.graph import ExpressionGraph


class Node:
    def __init__(self, id: str, type: str, data: dict):
        self.id = id
        self.type = type
        self.data = data
        self.inputs: list[str] = []

    def calc(self, graph: ExpressionGraph) -> Expr:
        raise NotImplementedError("This method should be implemented by subclasses")

    def __repr__(self) -> str:
        return f"Node({self.id}, {self.type}, {self.data}, {self.inputs})"


class FixedNode(Node):
    def __init__(self, id: str, type: str, data: dict):
        super().__init__(id, type, data)
        self.result: Expr | None = None


class ResultNode(Node):
    def __init__(self, id: str, data: dict):
        super().__init__(id, "result", data)

    def calc(self, graph: ExpressionGraph) -> Expr:
        expr_node = graph.get_linked_node(self.id, "inp-1")
        if expr_node is None:
            raise ValueError("No linked node for result found")

        return expr_node.calc(graph)


class ExpressionNode(FixedNode):
    def __init__(self, id: str, data: dict):
        super().__init__(id, "expression", data)

    def calc(self, graph: ExpressionGraph) -> Expr:
        if self.result is None:
            self.result = parse_expr(self.data["value"], evaluate=False)
        return self.result


class JoinNode(Node):
    def __init__(self, id: str, data: dict):
        super().__init__(id, "join", data)

    def calc(self, graph: ExpressionGraph) -> Expr:
        expr_1_node = graph.get_linked_node(self.id, "expression-1")
        if expr_1_node is None:
            raise ValueError("No linked node for expression 1 found")

        expr_2_node = graph.get_linked_node(self.id, "expression-2")
        if expr_2_node is None:
            raise ValueError("No linked node for expression 2 found")

        expr_1 = expr_1_node.calc(graph)
        expr_2 = expr_2_node.calc(graph)

        operator = self.data["operator"]
        if operator == "+":
            return Add(expr_1, expr_2, evaluate=False)
        elif operator == "-":
            return parse_expr(f"({str(expr_1)})-({str(expr_2)})", evaluate=False)
        elif operator == "*":
            if self.data["expand"]:
                return expand(Mul(expr_1, expr_2, evaluate=False), evaluate=False)
            return Mul(expr_1, expr_2, evaluate=False)
        elif operator == "/":
            return parse_expr(f"({str(expr_1)})/({str(expr_2)})", evaluate=False)

        raise ValueError(f"Unknown operator: {operator}")


class SubstitutionNode(Node):
    def __init__(self, id: str, data: dict):
        super().__init__(id, "substitution", data)

    def calc(self, graph: ExpressionGraph) -> Expr:
        expr_node1 = graph.get_linked_node(self.id, "source-expression")
        expr_node2 = graph.get_linked_node(self.id, "expression-to-substitute")

        sourceExpr: Expr = (
            parse_expr(self.data["sourceExpression"], evaluate=False)
            if expr_node1 is None
            else expr_node1.calc(graph)
        )

        substituteExpr: Expr = (
            parse_expr(self.data["substituteExpression"], evaluate=False)
            if expr_node2 is None
            else expr_node2.calc(graph)
        )

        with evaluate(False):
            sourceExpr = sourceExpr.subs(self.data["variable"], substituteExpr)

        return sourceExpr


class InversionNode(Node):
    def __init__(self, id: str, data: dict):
        super().__init__(id, "inversion", data)

    def calc(self, graph: ExpressionGraph) -> Expr:
        expr_node = graph.get_linked_node(self.id, "expression")
        if expr_node is None:
            raise ValueError("No linked node for expression found")

        expr: Expr = expr_node.calc(graph)

        return -1 * expr


class SimplificationNode(Node):
    def __init__(self, id: str, data: dict):
        super().__init__(id, "simplification", data)

    def calc(self, graph: ExpressionGraph) -> Expr:
        expr_node = graph.get_linked_node(self.id, "expression")
        if expr_node is None:
            raise ValueError("No linked node for expression found")

        expr: Expr = expr_node.calc(graph)

        return simplify(expr)


class ExpandNode(Node):
    def __init__(self, id: str, data: dict):
        super().__init__(id, "expand", data)

    def calc(self, graph: ExpressionGraph) -> Expr:
        expr_node = graph.get_linked_node(self.id, "expression")
        if expr_node is None:
            raise ValueError("No linked node for expression found")

        expr: Expr = expr_node.calc(graph)

        return expand(expr, evaluate=False)


class PowNode(Node):
    def __init__(self, id: str, data: dict):
        super().__init__(id, "pow", data)

    def calc(self, graph: ExpressionGraph) -> Expr:
        expr_node1 = graph.get_linked_node(self.id, "source-expression")
        expr_node2 = graph.get_linked_node(self.id, "degree-expression")

        sourceExpr: Expr = (
            parse_expr(self.data["sourceExpression"], evaluate=False)
            if expr_node1 is None
            else expr_node1.calc(graph)
        )

        substituteExpr: Expr = (
            parse_expr(self.data["degree"], evaluate=False)
            if expr_node2 is None
            else expr_node2.calc(graph)
        )

        return Pow(sourceExpr, substituteExpr, evaluate=False)


class LimitNode(Node):
    def __init__(self, id: str, data: dict):
        super().__init__(id, "limit", data)

    def calc(self, graph: ExpressionGraph) -> Expr:
        expr_node1 = graph.get_linked_node(self.id, "source-expression")
        expr_node2 = graph.get_linked_node(self.id, "limit-target")

        sourceExpr: Expr = (
            parse_expr(self.data["sourceExpression"], evaluate=False)
            if expr_node1 is None
            else expr_node1.calc(graph)
        )

        limitTarget: Expr = (
            parse_expr(self.data["limitTarget"], evaluate=False)
            if expr_node2 is None
            else expr_node2.calc(graph)
        )

        limitVariable = self.data["limitVariable"]
        limitDir = self.data["limitDir"]

        return Limit(sourceExpr, limitVariable, limitTarget, limitDir)


class BranchNode(Node):
    def __init__(self, id: str, data: dict):
        super().__init__(id, "branch", data)

    def calc(self, graph: ExpressionGraph) -> Expr:
        branches = self.data["branches"]
        random_branch_index = random.randint(0, len(branches) - 1)

        expr_node = graph.get_linked_node(self.id, f"branch-{random_branch_index}")
        expr: Expr = (
            parse_expr(branches[random_branch_index], evaluate=False)
            if expr_node is None
            else expr_node.calc(graph)
        )

        return expr


def create_node_from_type(node_type: str, id: str, data: dict) -> Node:
    node_classes = {
        "expression": ExpressionNode,
        "join": JoinNode,
        "substitution": SubstitutionNode,
        "inversion": InversionNode,
        "simplification": SimplificationNode,
        "expand": ExpandNode,
        "pow": PowNode,
        "limit": LimitNode,
        "branch": BranchNode,
        "result": ResultNode,
    }

    return node_classes.get(node_type, Node)(id, data)
