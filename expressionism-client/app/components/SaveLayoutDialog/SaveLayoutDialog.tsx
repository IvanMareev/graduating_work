import React from "react";
import { Modal, Box, Typography, Stack, Button, Alert } from "@mui/material";

type SaveLayoutDialogProps = {
  open: boolean;
  handleClose: () => void;
  handleOption1: () => void;
  handleOption2: () => void;
  routeToPage: () => void;
  isExistTitle: boolean
};

const SaveLayoutDialog: React.FC<SaveLayoutDialogProps> = ({
  open,
  handleClose,
  handleOption1,
  handleOption2,
  routeToPage,
  isExistTitle
}) => {
  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          minWidth: 300,
        }}
      >
        <Typography variant="h6" mb={2}>Сохранить результаты генерации?</Typography>
        {isExistTitle &&
          <Alert variant="outlined" severity="info" sx={{ mb: 2 }}>
            Ранее вы сохряняли макеты в этом генераторе,
            Вы хотите сохранить новые результаты?
          </Alert>}
        <Stack spacing={2} direction="row" justifyContent="flex-end">
          <Button variant="outlined" onClick={handleOption1}>
            Продолжить редакцию
          </Button>
          {isExistTitle &&
            <Button variant="contained" onClick={routeToPage}>
              Посмотреть варианты
            </Button>}
          <Button variant="contained" onClick={handleOption2}>
            {isExistTitle ? 'Сохранить новые результаты' : 'Сохранить'}
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export default SaveLayoutDialog;
