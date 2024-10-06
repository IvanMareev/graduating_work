import json
from expressionism.core import Expressionism, IntegerCoefficient, FloatCoefficient
from expressionism.graph import ExpressionGraph
from icecream import ic
from models import Generator


class GeneratorDescription:
    name: str
    task_text: str
    variables: str
    coefficients: str
    restricts: str
    content: str

    def __repr__(self):
        return f"GeneratorDescription({self.name}, {self.task_text}, {self.variables}, {self.coefficients}, {self.restricts}, {self.content})"


class GeneratorSystem:
    def __init__(self):
        self.ex: Expressionism = Expressionism()
        pass

    def generate(self, variants_count: int, generators: list[Generator]):
        results = list()
        for generator in generators:
            expression_graph = ExpressionGraph.parse_from_json(generator.content)

            raw_coefficients = json.loads(generator.coefficients)
            coefficients = [
                IntegerCoefficient(c["name"], c["min"], c["max"])
                if c["type"] == "Целое"
                else FloatCoefficient(c["name"], c["min"], c["max"])
                for c in raw_coefficients
            ]

            task_variants = list()
            for _ in range(variants_count):
                expression_template = self.ex.build_expression_template(expression_graph)
                expression = self.ex.concretization(expression_template, coefficients)
                task_variants.append(str(expression))

            results.append(
                {"task_text": generator.task_text, "variants": task_variants}
            )

        return results
