import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";
import { Box, Container } from "@/styled-system/jsx";
import DisciplineTreeView, { courseTreeState } from "./components/DisciplineTree/DisciplineTreeView";
// import Auth from "./components/Auth";
// TODO вернуть компонент максима 
export default function Home() {
    return (
        <Container display="flex" gap={4} flexDir="column" h="screen" minH={0} maxH="screen" py={3}>
            <Header />
            <Box boxSizing="border-box" flex="1 0" minH="400px">
                <DisciplineTreeView courseTreeState={courseTreeState} />
            </Box>
            <Footer />
        </Container>
    );
}
