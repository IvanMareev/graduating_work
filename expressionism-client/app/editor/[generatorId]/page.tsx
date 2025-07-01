"use client";

import { fetcherGet } from "@/app/api/fetchers";
import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";
import GeneratorOptionsEditor, {
    GeneratorOptionsRef,
} from "@/app/components/NodeGraphEditor/GeneratorOptionsEditor";
import NodeGraphEditor, { NodeGraphRef } from "@/app/components/NodeGraphEditor/NodeGraphEditor";
import { Generator, Topic } from "@/app/types/model";
import { css, sva } from "@/styled-system/css";
import { Box, Container } from "@/styled-system/jsx";
import "@xyflow/react/dist/style.css";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "primereact/button";
import { useEffect, useRef, useState } from "react";
import useSWR from "swr";

const pageStyles = sva({
    className: "results",
    slots: [
        "root",
        "breadcrumbContainer",
        "breadcrumb",
        "results",
        "variants",
        "toolbar",
        "viewport",
        "boxHeader",
        "selectButton",
    ],
    base: {
        root: {
            display: "grid",
            gap: "12px 16px",
            gridTemplateColumns: "400px 1fr",
            gridTemplateRows: "32px 1fr 1fr",
            gridAutoFlow: "row",
            gridTemplateAreas: `"breadcrumb viewport" "results viewport" "results viewport"`,
        },
        breadcrumbContainer: {
            gridArea: "breadcrumb",
            display: "flex",
            gap: 2,
            alignItems: "center",
            minW: 0,
        },
        breadcrumb: {
            display: "flex",
            gap: 1,
            alignItems: "center",
            minW: 0,
            "& span": {
                color: "fg.subtle",
                cursor: "default",
                textOverflow: "ellipsis",
                overflow: "hidden",
                whiteSpace: "nowrap",
                textWrap: "nowrap",
                maxW: "180px",
            },
            "& span:last-child": {
                color: "fg.default",
                textOverflow: "ellipsis",
                overflow: "hidden",
                whiteSpace: "nowrap",
                textWrap: "nowrap",
                maxW: "200px",
            },
        },
        results: { gridArea: "results", display: "flex", flexDir: "column", gap: 2 },
        viewport: {
            gridArea: "viewport",
            bgColor: "slate.6",
            borderRadius: "md",
            border: "2px solid token(colors.slate.8)",
        },
        boxHeader: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: 2,
            px: 2,
            "& span": {
                color: "fg.subtle",
                fontSize: "sm",
            },
        },
        selectButton: {
            "& .p-button": {
                py: "1!",
                px: "2!",
                fontSize: "sm!",
            },
        },
    },
});

export default function GeneratorEditorPage({ params }: { params: { generatorId: number } }) {
    const { data } = useSWR<Generator>(`generators/${params.generatorId}`, fetcherGet, {
        revalidateOnFocus: false,
    });

    const [topicName, setTopicName] = useState("");
    const [generatorName, setGeneratorName] = useState("");

    const styles = pageStyles();
    const router = useRouter();
    const graphRef = useRef<NodeGraphRef>(null);
    const genOptionsRef = useRef<GeneratorOptionsRef>(null);

    const handleGraphSave = async () => {
        await graphRef.current?.save();
        await genOptionsRef.current?.save();
    };

    useEffect(() => {
        if (data == null) return;
        fetcherGet(`topics/${data.topic_id}`).then((topic: Topic) => setTopicName(topic.name));
        setGeneratorName(data.name);
    }, [data]);

    return (
        <Container
            display="flex"
            gap={4}
            flexDir="column"
            h="screen"
            minH={0}
            maxH="screen"
            py={3}
            maxW="1800px"
        >
            <Header size="small" />
            <Box flex="1 0" minH="400px">
                <Box
                    className={styles.root}
                    borderRadius="xl"
                    w="full"
                    h="full"
                    p={3}
                    bgColor="slate.4"
                >
                    <div className={styles.breadcrumbContainer}>
                        <ArrowLeft
                            className={css({
                                cursor: "pointer",
                                transition: "background 0.1s",
                                borderRadius: "md",
                                _hover: { background: "slate.7" },
                            })}
                            onClick={async () => {
                                await handleGraphSave();
                                router.push("/");
                            }}
                        />
                        <div className={styles.breadcrumb}>
                            <span>...</span>
                            <span>/</span>
                            <span>{topicName}</span>
                            <span>/</span>
                            <span>{generatorName}</span>
                        </div>
                    </div>
                    <div className={styles.results}>
                        <GeneratorOptionsEditor
                            ref={genOptionsRef}
                            generatorId={params.generatorId}
                        />
                        <Button
                            label="Сохранить"
                            onClick={async () => {
                                await handleGraphSave();
                            }}
                        />
                    </div>
                    <div className={styles.viewport}>
                        <NodeGraphEditor ref={graphRef} generatorId={params.generatorId} />
                    </div>
                </Box>
            </Box>
            <Footer />
        </Container>
    );
}
