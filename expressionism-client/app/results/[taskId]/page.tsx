"use client";

import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";
import { GenerationResult, Task } from "@/app/types/model";
import { sva } from "@/styled-system/css";
import { Box, Center, Container } from "@/styled-system/jsx";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { SelectButton } from "primereact/selectbutton";
import { useCallback, useState } from "react";

import { fetcherGet } from "@/app/api/fetchers";
import ResultsList from "@/app/components/Results/ResultsList";
import VariantsList, { Variant } from "@/app/components/Results/VariantsList";

import PdfViewer from "@/app/components/Results/PdfViewer";
import { ConfirmPopup } from "primereact/confirmpopup";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { Tooltip } from "react-tooltip";
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
        "selectButton",
    ],
    base: {
        root: {
            display: "grid",
            gap: "12px 16px",
            gridTemplateColumns: "400px 1fr",
            gridTemplateRows: "48px minmax(0,1fr) minmax(0,1fr)",
            gridTemplateAreas: `"breadcrumb toolbar" "results viewport" "variants viewport"`,
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
        results: { gridArea: "results" },
        variants: { gridArea: "variants" },
        toolbar: {
            gridArea: "toolbar",
            bgColor: "slate.1",
            borderRadius: "md",
            boxShadow: "sm",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            pl: 4,
            pr: 2,
            "& .results__breadcrumb": {
                fontSize: "sm",
            },
        },
        viewport: {
            gridArea: "viewport",
            bgColor: "slate.6",
            borderRadius: "md",
            overflow: "hidden",
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

const selectButtonOptions = ["Без ответов", "С ответами"];

export default function ResultsPage({ params }: { params: { taskId: number } }) {
    const { data } = useSWR<Task>(`tasks/${params.taskId}`, fetcherGet, {
        keepPreviousData: true,
        revalidateOnFocus: false,
    });

    const [selectButtonValue, setSelectButtonValue] = useState(selectButtonOptions[0]);
    const [genResult, setGenResult] = useState<GenerationResult | null>(null);
    const [variant, setVariant] = useState<Variant | null>(null);
    const [previewFileUrl, setPreviewFileUrl] = useState<string>("");

    const handleResultSelect = useCallback((result: GenerationResult | null) => {
        setGenResult(result);
    }, []);

    const handleVariantSelect = useCallback(
        (variant: Variant | null) => {
            setVariant(variant);
            if (variant == null) {
                if (genResult != null)
                    setPreviewFileUrl(`http://127.0.0.1:5000/results/${genResult.id}/export`);
                return;
            }
            setPreviewFileUrl(
                `http://127.0.0.1:5000/variants/${variant.id}/${selectButtonValue === "С ответами" ? "answers" : "document"}`,
            );
        },
        [genResult, selectButtonValue],
    );

    const styles = pageStyles();

    return (
        <Container display="flex" gap={4} flexDir="column" h="screen" minH={0} maxH="screen" py={3}>
            <Header />
            <Box flex="1 1 0" minH="400px">
                <Box
                    className={styles.root}
                    borderRadius="xl"
                    w="full"
                    h="full"
                    p={3}
                    bgColor="slate.4"
                >
                    <div className={styles.breadcrumbContainer}>
                        <Link href="/">
                            <ArrowLeft />
                        </Link>
                        <div className={styles.breadcrumb}>
                            <span>...</span>
                            <span>/</span>
                            <span>{data != null ? data.topic.name : "..."}</span>
                            <span>/</span>
                            <span>{data != null ? data.name : "..."}</span>
                        </div>
                    </div>
                    <div className={styles.results}>
                        <ResultsList task={data} onResultSelect={handleResultSelect} />
                    </div>
                    <div className={styles.variants}>
                        <VariantsList genResult={genResult} onVariantSelect={handleVariantSelect} />
                    </div>
                    <div className={styles.toolbar}>
                        {data == null || genResult == null ? null : (
                            <>
                                <div className={styles.breadcrumb}>
                                    <span>{genResult?.name}</span>
                                    <span>/</span>
                                    <span>{variant?.name}</span>
                                </div>
                                <SelectButton
                                    className={styles.selectButton}
                                    value={selectButtonValue}
                                    onChange={(e) => setSelectButtonValue(e.value)}
                                    options={selectButtonOptions}
                                    allowEmpty={false}
                                />
                            </>
                        )}
                    </div>
                    <div className={styles.viewport}>
                        {genResult == null ? (
                            <Center textAlign="center" color="fg.subtle" w="full" h="full">
                                Для предпросмотра выберите вариант в списке слева
                            </Center>
                        ) : (
                            <PdfViewer fileUrl={previewFileUrl} />
                        )}
                    </div>
                </Box>
            </Box>
            <Footer />
            <Tooltip id="button-tooltip" />
            <ConfirmPopup />
        </Container>
    );
}
