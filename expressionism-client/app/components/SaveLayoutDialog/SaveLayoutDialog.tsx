"use client";

import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Message } from "primereact/message";
import { Edit, Eye, Save } from "lucide-react";

type SaveLayoutDialogProps = {
  open: boolean;
  handleClose: () => void;
  handleOption1: () => void;
  handleOption2: () => void;
  routeToPage: () => void;
  isExistTitle: boolean;
};

const SaveLayoutDialog = ({
  open,
  handleClose,
  handleOption1,
  handleOption2,
  routeToPage,
  isExistTitle,
}: SaveLayoutDialogProps) => {
  return (
    <Dialog
      header="Сохранить результаты генерации?"
      visible={open}
      style={{ width: "60rem" }}
      onHide={handleClose}
      modal
      draggable={false}
      closable
    >
      {isExistTitle && (
  <div style={{ margin: '1rem'}}>
    <Message
      severity="info"
      text="Ранее вы сохраняли макеты в этом генераторе. Вы хотите сохранить новые результаты?"
      style={{width:'100%' }}
    />
    <br></br>
  </div>
)}

      <div className="flex justify-end gap-2 mt-4">
        <Button
          label="Продолжить редакцию"
          icon={<Edit size={16} />}
          severity="secondary"
          onClick={handleOption1}
          style={{margin:'1rem', marginLeft:'2rem'}}
        />
        {isExistTitle && (
          <Button
            label="Посмотреть варианты"
            icon={<Eye size={16} />}
            onClick={routeToPage}
            style={{margin:'1rem'}}
          />
        )}
        <Button
          label={isExistTitle ? "Сохранить новые результаты" : "Сохранить"}
          icon={<Save size={16} />}
          severity="success"
          onClick={handleOption2}
          style={{margin:'1rem'}}
        />
      </div>
    </Dialog>
  );
};

export default SaveLayoutDialog;
