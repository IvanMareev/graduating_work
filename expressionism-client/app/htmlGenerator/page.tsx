"use client";

import * as React from "react";
import {
  Tabs,
  Tab,
  Box,
  Typography,
  CircularProgress,
  Paper,
  Button,
  Stack,
} from "@mui/material";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import LevelGenerator from "@/app/htmlGenerator/LevelGenerator/page";
import readyMadeCombinationsServices from "@/app/services/firstLevelServices/readyMadeCombinationsServices";
import HtmlCombinationPreview from "../components/HtmlCombinationPreview/HtmlCombinationPreview";
import { Settings, Play, Plus } from "lucide-react";

export default function BasicTabs() {
  const [tabIndex, setTabIndex] = React.useState(0);
  const level = tabIndex + 1;
  const [loading, setLoading] = React.useState<boolean>(false);
  const [blocks, setBlocks] = React.useState<any | null>(null);

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  React.useEffect(() => {
    const loadPreview = async () => {
      setLoading(true);
      try {
        const data = await readyMadeCombinationsServices(1, level);
        setBlocks(data);
      } catch (error) {
        console.error("Ошибка загрузки данных:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPreview();
  }, [level]);

  return (
      <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
        <Box
            sx={{
              px: 2,
              py: 1,
              borderBottom: 1,
              borderColor: "divider",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: "#f9f9f9",
            }}
        >
          <Tabs value={tabIndex} onChange={handleChange}>
            <Tab label="1 уровень" />
            <Tab label="2 уровень" />
            <Tab label="3 уровень" />
          </Tabs>

          <Stack direction="row" spacing={1}>
            <Button
                variant="contained"
                startIcon={<Play size={18} />}
                sx={{ textTransform: "none" }}
            >
              Генерация
            </Button>
            <Button
                variant="outlined"
                startIcon={<Settings size={18} />}
                sx={{ textTransform: "none" }}
            >
              Админка
            </Button>
          </Stack>
        </Box>

        <PanelGroup direction="horizontal" style={{ flexGrow: 1 }}>
          <Panel defaultSize={60} minSize={20}>
            <Box sx={{ height: "100%", overflowY: "auto", p: 2 }}>
              <LevelGenerator level={level} />
            </Box>
          </Panel>

          <PanelResizeHandle
              style={{
                width: "5px",
                background: "#ddd",
                cursor: "col-resize",
              }}
          />

          <Panel defaultSize={40} minSize={20}>
            <Box sx={{ p: 2, height: "100%", overflowY: "auto" }}>
              <Typography variant="h6" gutterBottom>
                Предпросмотр
              </Typography>
              <Paper elevation={3} sx={{ p: 2, minHeight: "300px" }}>
                {loading ? (
                    <CircularProgress />
                ) : blocks ? (
                    <HtmlCombinationPreview blocks={blocks} />
                ) : (
                    <Typography variant="body2">
                      Нет данных для отображения
                    </Typography>
                )}
              </Paper>
            </Box>
          </Panel>
        </PanelGroup>
      </Box>
  );
}
