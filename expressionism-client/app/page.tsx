import { Box, Container } from "@/styled-system/jsx";
import React from "react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { ConfirmDialog } from "primereact/confirmdialog";
import { ConfirmPopup } from "primereact/confirmpopup";
import DisciplineTreeView from "./components/NewDisciplineTree/DisciplineTreeView";

export default function Home() {
    return (
        <>
            <Container
                display="flex"
                gap={4}
                flexDir="column"
                h="screen"
                minH={0}
                maxH="screen"
                py={3}
            >
                <Header />
                <Box boxSizing="border-box" flex="1 0" minH="400px">
                    <DisciplineTreeView />
                </Box>
                <Footer />
            </Container>
            <ConfirmPopup />
            <ConfirmDialog />
        </>
    );
}
