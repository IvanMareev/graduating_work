from sympy import (
    Add,
    Expr,
    Limit,
    Symbol,
    evaluate,
)

from expressionism.graph import ExpressionGraph
from icecream import ic
import random


class NumberCoefficient:
    def __init__(self, name: str, min_value: int | float, max_value: int | float):
        self.symbol = Symbol(name)
        self.min: int | float = min_value
        self.max: int | float = max_value

    def get_value(self) -> int | float:
        raise NotImplementedError("This method should be implemented by subclasses")

    def __repr__(self) -> str:
        return f"{self.__class__.__name__}({self.symbol}, {self.min}, {self.max})"


class IntegerCoefficient(NumberCoefficient):
    def __init__(self, name: str, min_value: int, max_value: int):
        super().__init__(name, min_value, max_value)

    def get_value(self) -> int:
        return random.randint(self.min, self.max)


class FloatCoefficient(NumberCoefficient):
    def __init__(self, name: str, min_value: float, max_value: float):
        super().__init__(name, min_value, max_value)

    def get_value(self) -> float:
        return random.uniform(self.min, self.max)


class Expressionism:
    def build_expression_template(self, graph: ExpressionGraph):
        result_node = next(
            (node for node in graph.nodes if node.type == "result"), None
        )

        if result_node is None:
            raise ValueError("No result node found")

        template = result_node.calc(graph)

        return template

    def concretization(
        self, template: Expr, coefficients: list[NumberCoefficient]
    ) -> Expr:
        concrete_expression = template
        with evaluate(False):
            concrete_coefficients = []
            for c in coefficients:
                c_value = 0
                attempt = 0
                while c_value == 0:
                    c_value = c.get_value()
                    attempt += 1
                    if attempt > 100:
                        raise ValueError(f"Cannot generate value for coefficient {c}")
                concrete_coefficients.append((c.symbol, c_value))
            concrete_expression = concrete_expression.subs(concrete_coefficients)

        # A little expression simplification
        if ic(len(concrete_expression.free_symbols)) > 0:
            ic("Expression simplified")
            concrete_expression = concrete_expression.simplify().evalf()
        else:
            concrete_expression = concrete_expression.replace(
                lambda e: not isinstance(e, (Limit, Add)), lambda e: e.doit(deep=False)
            )

        return concrete_expression
