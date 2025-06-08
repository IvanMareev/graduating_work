import React, { useState } from 'react';
import { Typography, Box, Button, Modal } from '@mui/material';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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
    dots: true,
    infinite: false,
    speed: 300,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 900,
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
        }
      }
    ]
  };

  return (
    <Box>
      <Slider {...settings}>
        {allCombinations.map((combo) => (
          <Box key={combo.groupName} sx={{ px: 1 }}>
            <Button
              variant="outlined"
              onClick={() => setOpenIndex(combo.index)}
              sx={{
                width: '100%',
                height: 130,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                p: 1,
                textTransform: 'none',
                overflow: 'hidden', // убираем скроллы у кнопки
              }}
            >
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  backgroundColor: '#fff',
                  pointerEvents: 'none',
                  transform: 'scale(0.8)',
                  transformOrigin: 'top center',
                  overflow: 'hidden', // убираем скроллы у превью
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
