"use client";
import React, { useEffect, useState } from 'react';
import BlockList from '@/app/components/HTMLGenerator/BlockList/BlockList';
import BlocksWithIntersectionOptions from '@/app/components/HTMLGenerator/BlocksWithIntersectionOptions/BlocksWithIntersectionOptions';
import groupedContainerServices from '@/app/services/firstLevelServices/groupedContainerServices';
import groupedContainerWireframeServices from '@/app/services/firstLevelServices/groupedContainerWireframeServices';


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
};

const LevelGenerator: React.FC<LevelGeneratorProps> = ({ level }) => {
  const [loading, setLoading] = useState(true);
  const [group, setGroup] = useState<GroupedBlocks | GroupedBlockVariants>({});
  const [wireframe, setWireframe] = useState<any>({});

  useEffect(() => {
    setLoading(true);
    const loadData = async () => {
      try {
        const groupedContainer = await groupedContainerServices(1, level);
        console.log("данные groupedContainerServices", level, groupedContainer);
        
        const wireframe = await groupedContainerWireframeServices(1, level);
        setGroup(groupedContainer);
        setWireframe(wireframe)
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [level]);

  return (
    <div style={{ maxHeight: '100vh', overflowY: 'auto', padding: '1rem' }}>
      <h1>Шаг {level}. Генерация {level} уровня</h1>
      {loading ? (
        <p>Загрузка...</p>
      ) : level === 1 ? (
        <BlockList blocks={group as GroupedBlocks}  level={level}/>
      ) : level === 2 || level === 3 ? (
        <BlocksWithIntersectionOptions wireframe={wireframe} groups={group} level={level} />
      ) : (
        <p>Неизвестный уровень: {level}</p>
      )}
    </div>
  );
};

export default LevelGenerator;
