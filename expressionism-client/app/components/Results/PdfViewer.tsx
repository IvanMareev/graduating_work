import { css } from "@/styled-system/css";
import { Box, Center } from "@/styled-system/jsx";
import { useState } from "react";

import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/legacy/build/pdf.worker.min.mjs",
    import.meta.url,
).toString();

const PdfViewer = (props: { fileUrl: string }) => {
    const [numPages, setNumPages] = useState<number>();

    function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
        setNumPages(numPages);
    }

    return (
        <Box
            display="flex"
            flexDir="column"
            alignItems="center"
            bgColor="slate.10"
            gap={8}
            overflow="auto"
            position="relative"
            h="full"
            w="full"
            p={4}
        >
            <Document
                file={props.fileUrl}
                loading={
                    <Center w="full" h="full" textAlign="center">
                        Загрузка предпросмотра...
                    </Center>
                }
                onLoadSuccess={onDocumentLoadSuccess}
            >
                {numPages &&
                    Array.from(new Array(numPages), (_, i) => (
                        <Page key={i + 1} pageNumber={i + 1} className={css({ mb: 4 })} height={1100} />
                    ))}
            </Document>
        </Box>
    );
};

export default PdfViewer;
