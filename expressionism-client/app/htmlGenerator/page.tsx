"use client";

import * as React from "react";
import {
  Tabs,
  Tab,
  Box,
  CircularProgress,
  Button,
  Stack,
  Paper,
} from "@mui/material";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import LevelGenerator from "@/app/htmlGenerator/LevelGenerator/page";
import readyMadeCombinationsServices from "@/app/services/firstLevelServices/readyMadeCombinationsServices";
import HtmlCombinationPreview from "../components/HtmlCombinationPreview/HtmlCombinationPreview";
import { Settings, Play } from "lucide-react";

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
      {/* Верхняя панель с табами и кнопками */}
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

      {/* Центральная часть: LevelGenerator */}
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
            <Box sx={{ height: "100%", overflowY: "auto", p: 2 }}>
              <LevelGenerator level={level} />
            </Box>
          

          

        {/* Нижний блок с HtmlCombinationPreview */}
        {blocks && (
          <Box
            sx={{
              borderTop: 1,
              borderColor: "divider",
              backgroundColor: "#fff",
              p: 2,
              maxHeight: "110vh",
              overflowY: "hidden",
            }}
          >
            <HtmlCombinationPreview blocks={blocks} />
          </Box>
        )}
      </Box>
    </Box>
  );
}
