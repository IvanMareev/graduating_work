import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Button,
  Modal,
  IconButton,
  Paper,
} from '@mui/material';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
  ChevronLeft,
  ChevronRight,
  ViewQuilt as ViewQuiltIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import prefixCSS from '@/app/utils/PrefixCSS';

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
  [key: string]: Block[];
};

type HtmlCombinationPreviewProps = {
  blocks: GroupedBlocks;
};




const CustomArrow = ({ direction, onClick }: { direction: 'left' | 'right'; onClick?: () => void }) => (
  <IconButton
    onClick={onClick}
    sx={{
      position: 'absolute',
      top: '0%',
      [direction]: -20,
      transform: 'translateY(-50%)',
      backgroundColor: '#e4e4e4',
      border: '1px solid #ccc',
      boxShadow: 1,
      zIndex: 2,
      '&:hover': {
        backgroundColor: '#d6d6d6',
      },
    }}
    aria-label={direction === 'left' ? 'Previous' : 'Next'}
  >
    {direction === 'left' ? <ChevronLeft /> : <ChevronRight />}
  </IconButton>
);

const HtmlCombinationPreview: React.FC<HtmlCombinationPreviewProps> = ({ blocks }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [sortedBlocks, setSortedBlocks] = useState<GroupedBlocks>({});

  useEffect(() => {
    const sorted: GroupedBlocks = {};
    for (const [groupName, groupBlocks] of Object.entries(blocks)) {
      const activeBlocks = groupBlocks.filter((block) => block.is_active !== false);
      sorted[groupName] = [...activeBlocks].sort((a, b) => a.level - b.level);
    }

    setSortedBlocks(sorted);
  }, [blocks]);

  const allCombinations = Object.entries(sortedBlocks).map(([groupName, groupBlocks], groupIndex) => {
    const prefix = `group-${groupIndex}`;

    const html = `<div class="${prefix}">\n${groupBlocks.map(block => block.html).join('\n')}\n</div>`;

    const css = prefixCSS(groupBlocks.map(block => block.css_style).join('\n'), prefix);

    return {
      groupName,
      html,
      css,
      level: groupBlocks[0]?.level ?? 0,
      index: groupIndex,
    };
  });


  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: <CustomArrow direction="right" />,
    prevArrow: <CustomArrow direction="left" />,
    responsive: [
      {
        breakpoint: 700,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  if (!blocks || Object.keys(blocks).length === 0) {
    return <Typography>Нет комбинаций для отображения</Typography>;
  }

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 0,
        borderRadius: 2,
        border: '2px solid #b4b4b4',
        boxShadow: 3,
        backgroundColor: '#f0f0f0',
        mb: 10,
        width: "97%",
        mx: 'auto',
        overflow: 'hidden'
      }}
    >
      <Box
        sx={{
          backgroundColor: '#d6d6d6',
          borderBottom: '1px solid #b4b4b4',
          px: 2,
          py: 1,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="subtitle1" fontWeight="bold">
          Варианты комбинаций компонентов {allCombinations.length} комбинации
        </Typography>
      </Box>

      <Box sx={{ p: 2, position: 'relative' }}>
        <Slider {...settings}>
          {allCombinations.map((combo) => (
            <Box key={combo.groupName} sx={{ px: 1 }}>
              <Button
                variant="outlined"
                onClick={() => setOpenIndex(combo.index)}
                sx={{
                  width: '100%',
                  height: 70,
                  p: 1.2,
                  borderRadius: 1.5,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textTransform: 'none',
                  backgroundColor: '#fff',
                  borderColor: '#ccc',
                  boxShadow: 1,
                  '&:hover': {
                    backgroundColor: '#f9f9f9',
                    boxShadow: 2,
                  },
                }}
              >
                <ViewQuiltIcon sx={{ fontSize: 28, color: 'primary.main', mb: 0.5 }} />
                <Typography variant="body2" color="textSecondary">
                  Макет {combo.index + 1}
                </Typography>
              </Button>
            </Box>
          ))}
        </Slider>
      </Box>

      {allCombinations.map((combo) => (
        <Modal
          key={combo.groupName}
          open={openIndex === combo.index}
          onClose={() => setOpenIndex(null)}

        >
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              bgcolor: '#fff',
              border: '2px solid #888',
              boxShadow: 24,
              maxHeight: '80vh',
              overflowY: 'auto',
              borderRadius: 1,
              width: 1000, 
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: '#d6d6d6',
                px: 2,
                py: 1,
                borderBottom: '1px solid #aaa',
              }}
            >
              <Typography variant="subtitle2" fontWeight="bold">
                Комбинация #{combo.index + 1} — {combo.groupName}
              </Typography>
              <IconButton size="small" onClick={() => setOpenIndex(null)}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
            <Box sx={{ p: 2 }}>
              <style>{combo.css}</style>
              <div dangerouslySetInnerHTML={{ __html: combo.html }} />
            </Box>
          </Box>
        </Modal>
      ))}
    </Paper>
  );
};

export default HtmlCombinationPreview;
