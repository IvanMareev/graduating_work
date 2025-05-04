"use client"; // Это важная строка для использования useRouter на клиенте
import BlockList from '@/app/components/HTMLGenerator/BlockList/BlockList';
import groupedContainerServices from '@/app/services/firstLevelServices/groupedContainerServices';
import React, { useEffect, useState } from 'react';

type Block = {
  id: number;
  name: string;
  level: number;
  html: string;
  css_style: string;
  always_eat: boolean;
  template_lvl1_id: number;
};

type GroupedBlocks = {
  [name: string]: Block[];
};

const GeneratorStep = () => {
  const [groupedContainer, setGroupedContainer] = useState<GroupedBlocks>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    groupedContainerServices(1)
      .then((data: GroupedBlocks) => {
        setGroupedContainer(data);
        setLoading(false);
      })
      .catch((error: Error) => {
        console.error('Ошибка при загрузке блоков:', error);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <h1>Шаг первый. Генерация первого уровня</h1>
      {loading ? <p>Загрузка...</p> : <BlockList blocks={groupedContainer} />}
    </>
  );
};

export default GeneratorStep;
