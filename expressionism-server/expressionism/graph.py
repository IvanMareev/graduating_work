import json

from expressionism.nodes import Node, create_node_from_type
from icecream import ic


class Edge:
    def __init__(
        self, source: Node, sourceHandle: str, target: Node, targetHandle: str
    ):
        self.source: Node = source
        self.sourceHandle: str = sourceHandle
        self.target: Node = target
        self.targetHandle: str = targetHandle

    def __repr__(self) -> str:
        return f"Edge({self.source}, {self.sourceHandle}, {self.target}, {self.targetHandle})"


class ExpressionGraph:
    def __init__(self):
        self.nodes: list[Node] = []
        self.edges: list[Edge] = []
        pass

    def __repr__(self) -> str:
        return f"ExpressionGraph({self.nodes}, {self.edges})"

    def get_node(self, id: str) -> Node | None:
        return next((node for node in self.nodes if node.id == id), None)

    def get_linked_node(self, node_id: str, input: str) -> Node | None:
        edge = next(
            (
                edge
                for edge in self.edges
                if edge.target.id == node_id and edge.targetHandle == input
            ),
            None,
        )

        if edge is None:
            return None

        return edge.source

    @staticmethod
    def parse_from_json(raw_json) -> "ExpressionGraph":
        data = json.loads(raw_json)

        graph = ExpressionGraph()

        graph.nodes = [
            create_node_from_type(node["type"], node["id"], node["data"])
            for node in data["nodes"]
        ]

        for raw_edge in data["edges"]:
            source_handle = raw_edge["sourceHandle"][
                raw_edge["sourceHandle"].index("handle-") + len("handle-") :
            ]
            target_handle = raw_edge["targetHandle"][
                raw_edge["targetHandle"].index("handle-") + len("handle-") :
            ]

            source = graph.get_node(raw_edge["source"])
            target = graph.get_node(raw_edge["target"])

            graph.edges.append(
                Edge(
                    source,
                    source_handle,
                    target,
                    target_handle,
                )
            )

            target.inputs.append(target_handle)

        return graph
