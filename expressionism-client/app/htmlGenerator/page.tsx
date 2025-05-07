"use client";

import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import LevelGenerator from '@/app/htmlGenerator/LevelGenerator/page';
import { Typography, CircularProgress, Paper, Button } from '@mui/material';
import readyMadeCombinationsServices from "@/app/services/firstLevelServices/readyMadeCombinationsServices";
import HtmlCombinationPreview from '../components/HtmlCombinationPreview/HtmlCombinationPreview';
import {
  Panel,
  PanelGroup,
  PanelResizeHandle,
} from "react-resizable-panels";

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
        console.error('Ошибка загрузки данных:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPreview();
  }, [level]);

  return (
    <Box sx={{ height: '100vh' }}>
      <PanelGroup direction="horizontal">
        <Panel defaultSize={60} minSize={20}>
          <Box sx={{ height: '100%', borderRight: 1, borderColor: 'divider' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={tabIndex} onChange={handleChange} aria-label="tabs">
                <Tab label="Первый Уровень" />
                <Tab label="Второй Уровень" />
                <Tab label="Третий Уровень" />
                <Button variant="outlined" >Начать генерацию</Button>
              </Tabs>
            </Box>

            <Box sx={{ p: 2 }}>
              <LevelGenerator level={level} />
            </Box>
          </Box>
        </Panel>

        <PanelResizeHandle style={{ width: "5px", background: "#ccc", cursor: "col-resize" }} />

        <Panel defaultSize={40} minSize={20}>
          <Box sx={{ p: 2, height: '100%', overflowY: 'auto' }}>
            <Typography variant="h6" gutterBottom>Предпросмотр</Typography>
            <Paper elevation={3} sx={{ p: 2, minHeight: '300px' }}>
              {loading ? (
                <CircularProgress />
              ) : blocks ? (
                <HtmlCombinationPreview blocks={blocks} />
              ) : (
                <Typography variant="body2">Нет данных для отображения</Typography>
              )}
            </Paper>
          </Box>
        </Panel>
      </PanelGroup>
    </Box>
  );
}
