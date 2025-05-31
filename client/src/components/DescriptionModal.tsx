import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

interface DescriptionModalProps {
  open: boolean;
  onClose: () => void;
  description: string;
}

const DescriptionModal: React.FC<DescriptionModalProps> = ({ open, onClose, description }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="description-dialog-title"
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle id="description-dialog-title">Ürün Açıklaması</DialogTitle>
      <DialogContent>
        <Typography variant="body1" component="p">
          {description}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Kapat
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DescriptionModal; 