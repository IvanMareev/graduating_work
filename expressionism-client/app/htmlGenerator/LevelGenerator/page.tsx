"use client";

import React, { useEffect, useState } from 'react';
import BlockList from '@/app/components/HTMLGenerator/BlockList/BlockList';
import BlocksWithIntersectionOptions from '@/app/components/HTMLGenerator/BlocksWithIntersectionOptions/BlocksWithIntersectionOptions';
import groupedContainerServices from '@/app/services/firstLevelServices/groupedContainerServices';
import groupedContainerWireframeServices from '@/app/services/firstLevelServices/groupedContainerWireframeServices';
import { Alert } from '@mui/material';

type Block = {
  id: number;
  name: string;
  level: number;
  html: string;
  css_style: string;
  always_eat: boolean;
  template_lvl1_id: number;
  insertion_options?: InsertionOption[];
};

type InsertionOption = {
  css_style: string;
  html: string;
  intersection_code: string;
  name: string;
  template_lvl1_id: number;
};

type GroupedBlocks = {
  [name: string]: Block[];
};

type GroupedBlockVariants = Block[][];

type LevelGeneratorProps = {
  level: number;
  onReqAgain?: () => void;
};

const LevelGenerator: React.FC<LevelGeneratorProps> = ({ level, onReqAgain }) => {
  const [loading, setLoading] = useState(true);
  const [group, setGroup] = useState<GroupedBlocks | GroupedBlockVariants>({});
  const [wireframe, setWireframe] = useState<any>({});
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    setLoading(true);
    const loadData = async () => {
      try {
        const groupedContainer = await groupedContainerServices(1, level);
        const wireframe = await groupedContainerWireframeServices(1, level);
        setGroup(groupedContainer);
        setWireframe(wireframe);
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [level, refreshKey]);

  const ReqAgainBlock = () => {
    setRefreshKey(prev => prev + 1);
    if (onReqAgain) onReqAgain();  // вызываем колбек из родителя, если есть
  };

  return (
    <div style={{ overflowY: 'hidden', padding: '1rem' }}>
      <Alert variant="outlined" severity="info" sx={{mb:2}}>
        Шаг {level}. Генерация {level} уровня
      </Alert>
      {loading ? (
        <p>Загрузка...</p>
      ) : level === 1 ? (
        <BlockList blocks={group as GroupedBlocks} level={level} ReqAgainBlock={ReqAgainBlock} />
      ) : level === 2 || level === 3 ? (
        <BlocksWithIntersectionOptions wireframe={wireframe} groups={group} level={level} ReqAgainBlock={ReqAgainBlock} />
      ) : (
        <p>Неизвестный уровень: {level}</p>
      )}
    </div>
  );
};

export default LevelGenerator;
