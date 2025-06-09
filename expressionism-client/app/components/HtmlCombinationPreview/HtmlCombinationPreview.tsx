import React, { useState } from 'react';
import { Typography, Box, Button, Modal, IconButton } from '@mui/material';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ChevronLeft, ChevronRight, ViewQuilt as ViewQuiltIcon } from '@mui/icons-material';

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

const CustomPrevArrow = ({ onClick }: { onClick?: () => void }) => (
  <IconButton
    onClick={onClick}
    sx={{
      position: 'absolute',
      top: '50%',
      left: 0,
      zIndex: 1,
      transform: 'translateY(-50%)',
      backgroundColor: 'white',
      boxShadow: 1,
      '&:hover': {
        backgroundColor: 'grey.100',
      },
    }}
    aria-label="Previous"
  >
    <ChevronLeft />
  </IconButton>
);

const CustomNextArrow = ({ onClick }: { onClick?: () => void }) => (
  <IconButton
    onClick={onClick}
    sx={{
      position: 'absolute',
      top: '50%',
      right: 0,
      zIndex: 1,
      transform: 'translateY(-50%)',
      backgroundColor: 'white',
      boxShadow: 1,
      '&:hover': {
        backgroundColor: 'grey.100',
      },
    }}
    aria-label="Next"
  >
    <ChevronRight />
  </IconButton>
);

const HtmlCombinationPreview: React.FC<HtmlCombinationPreviewProps> = ({ blocks }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!blocks || Object.keys(blocks).length === 0) {
    return <Typography>Нет комбинаций для отображения</Typography>;
  }

  const allCombinations = Object.entries(blocks).map(([groupName, groupBlocks], groupIndex) => {
    return {
      groupName,
      html: groupBlocks.map(block => block.html).join('\n'),
      css: groupBlocks.map(block => block.css_style).join('\n'),
      length: groupBlocks.length,
      index: groupIndex,
    };
  });

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    nextArrow: <CustomNextArrow />,
    prevArrow: <CustomPrevArrow />,
  };

  return (
    <Box sx={{ position: 'relative', width: '100%' }}>
      <Slider {...settings}>
        {allCombinations.map((combo) => (
          <Box key={combo.groupName} sx={{ px: 1 }}>
            <Button
              variant="outlined"
              onClick={() => setOpenIndex(combo.index)}
              sx={{
                width: 160,
                height: 160,
                p: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                textTransform: 'none',
                borderRadius: 2,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <ViewQuiltIcon sx={{ fontSize: 28, color: 'primary.main', mb: 1 }} />
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  border: '1px solid #ccc',
                  borderRadius: 1,
                  backgroundColor: '#fff',
                  pointerEvents: 'none',
                  transform: 'scale(0.8)',
                  transformOrigin: 'top center',
                  overflow: 'hidden',
                }}
                dangerouslySetInnerHTML={{
                  __html: `<style>${combo.css}</style>${combo.html}`,
                }}
              />
            </Button>
          </Box>
        ))}
      </Slider>

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
              bgcolor: 'background.paper',
              border: '2px solid #000',
              boxShadow: 24,
              p: 4,
              maxHeight: '90vh',
              overflowY: 'auto',
              width: '90%',
              maxWidth: 1000,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Комбинация #{combo.index + 1} (длина {combo.length}) - {combo.groupName}
            </Typography>

            <style>{combo.css}</style>

            <div dangerouslySetInnerHTML={{ __html: combo.html }} />
          </Box>
        </Modal>
      ))}
    </Box>
  );
};

export default HtmlCombinationPreview;
