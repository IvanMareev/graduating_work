"use client";

import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import GeneratorFirstLevel from '@/app/htmlGenerator/GeneratorFirstLevel/page';
import { Typography, CircularProgress, Paper } from '@mui/material';
import readyMadeCombinationsServices from "@/app/services/firstLevelServices/readyMadeCombinationsServices";
import HtmlCombinationPreview from '../components/HtmlCombinationPreview/HtmlCombinationPreview';
import {
  Panel,
  PanelGroup,
  PanelResizeHandle,
} from "react-resizable-panels";

export default function BasicTabs() {
  const [value, setValue] = React.useState(0);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [blocks, setBlocks] = React.useState<any | null>(null);

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  React.useEffect(() => {
    const loadPreview = async () => {
      setLoading(true);
      try {
        if (value === 0) {
          const data = await readyMadeCombinationsServices(1);
          setBlocks(data);
        } else {
          setBlocks({});
        }
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPreview();
  }, [value]);

  return (
    <Box sx={{ height: '100vh' }}>
      <PanelGroup direction="horizontal">
        {/* Левая панель */}
        <Panel defaultSize={60} minSize={20}>
          <Box sx={{ height: '100%', borderRight: 1, borderColor: 'divider' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={value} onChange={handleChange} aria-label="tabs">
                <Tab label="Первый Уровень" />
                <Tab label="Второй Уровень" />
                <Tab label="Третий Уровень" />
              </Tabs>
            </Box>

            <Box sx={{ p: 2 }}>
              {value === 0 && <GeneratorFirstLevel />}
              {value === 1 && <Typography>Редактор второго уровня</Typography>}
              {value === 2 && <Typography>Редактор третьего уровня</Typography>}
            </Box>
          </Box>
        </Panel>

        {/* Ручка между панелями */}
        <PanelResizeHandle style={{ width: "5px", background: "#ccc", cursor: "col-resize" }} />

        {/* Правая панель — предпросмотр */}
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
