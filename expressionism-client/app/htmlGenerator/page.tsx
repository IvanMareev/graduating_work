"use client";

import * as React from "react";
import {
  Tabs,
  Tab,
  Box,
  CircularProgress,
  Button,
  Stack,
} from "@mui/material";
import { Settings, Play } from "lucide-react";
import LevelGenerator from "@/app/htmlGenerator/LevelGenerator/page";
import readyMadeCombinationsServices from "@/app/services/firstLevelServices/readyMadeCombinationsServices";
import HtmlCombinationPreview from "../components/HtmlCombinationPreview/HtmlCombinationPreview";
import { useRouter } from "next/navigation";

export default function BasicTabs() {
  const router = useRouter();
  const [tabIndex, setTabIndex] = React.useState(0);
  const level = tabIndex + 1;
  const [loading, setLoading] = React.useState<boolean>(false);
  const [blocks, setBlocks] = React.useState<any | null>(null);

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  React.useEffect(() => {
    if (tabIndex <= 2) {
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
    }
  }, [tabIndex, level]);

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column", backgroundColor:"white" }}>
      {/* Верхняя панель */}
      <Box
        sx={{
          px: 2,
          pt: 1,
          borderBottom: "1px solid #ccc",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "rgba(176, 173, 224, 0.83)",
          color: "#fff",
          boxShadow: "0 2px 10px rgba(135, 132, 173, 0.83)",
        }}
      >
        <Tabs
          value={tabIndex}
          onChange={handleChange}
          TabIndicatorProps={{ style: { display: "none" } }}
          sx={{ minHeight: "auto" }}
        >
          {[
            "Компоненты",
            "Контейнеры",
            "Атомы",
            "Связь контейнеров с метками",
            "Связь атомов в метками",
          ].map((label, index) => (
            <Tab
              key={index}
              label={label}
              sx={{
                fontSize: "0.80rem",
                minHeight: 32,
                px: 1.5,
                py: 0,
                mr:1,
                textTransform: "none",
                borderTopLeftRadius: 8,
                borderTopRightRadius: 8,
                backgroundColor: tabIndex === index ? "#fff" : "#eee",
                color: tabIndex === index ? "#000" : "#777",
                boxShadow: tabIndex === index ? "0 -1px 4px rgba(0,0,0,0.15)" : "none",
              }}
            />
          ))}
        </Tabs>

        <Stack direction="row" spacing={1}>
          <Button
            variant="contained"
            size="small"
            onClick={() => router.push(`maket-viewer`)}
            startIcon={<Play size={12} />}
            sx={{
              fontSize: "10px",
              px: 1.5,
              minHeight: 28,
              textTransform: "none",
              backgroundColor: "#00bcd4",
              ":hover": { backgroundColor: "#0097a7" },
            }}
          >
            Генерация
          </Button>

          <Button
            variant="contained"
            size="small"
            startIcon={<Settings size={18} />}
            sx={{
              fontSize: "10px",
              px: 2,
              minHeight: 28,
              textTransform: "none",
              backgroundColor: "#00bcd4",
              ":hover": { backgroundColor: "#0097a7" },
            }}
          >
            Админка
          </Button>
        </Stack>
      </Box>

      {/* Контент вкладок */}
      <Box sx={{ flexGrow: 1, overflow: "hidden" }}>
        {tabIndex <= 2 ? (
          <Box sx={{ height: "100%", overflowY: "auto", p: 2 }}>
            <LevelGenerator level={level} />

            {loading ? (
              <Box display="flex" justifyContent="center" mt={4}>
                <CircularProgress />
              </Box>
            ) : (
              blocks && (
                <Box mt={2}>
                  <HtmlCombinationPreview blocks={blocks} />
                </Box>
              )
            )}
          </Box>
        ) : (
          <Box sx={{ height: "100%" }}>
            <iframe
              src={
                tabIndex === 3
                  ? "http://localhost:5000/admin/placeholdermatch/?embed=true"
                  : "http://localhost:5000/admin/placeholdermatchatoms/"
              }
              width="100%"
              height="100%"
              style={{ border: "none" }}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
}
