import React, { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
// Category tipi artık backendden gelmiyor, frontendde tanımlı
// import { Category } from '../types/category';

export interface ProductData {
  id?: number;
  name: string;
  price: number;
  description: string;
  createdAt?: string;
  updatedAt?: string;
}

// Sabit kategori listesi kaldırıldı
// const staticCategories = [ ... ];

interface ProductModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (newProduct: Omit<ProductData, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  onUpdate: (updatedProduct: ProductData) => Promise<void>;
  editingProduct: ProductData | null;
  viewingProduct?: ProductData | null;
  readOnly?: boolean;
  // categories: Category[]; // Artık backend'den gelmeyecek, kaldırıldı
}

const ProductModal: React.FC<ProductModalProps> = ({
  open,
  onClose,
  onAdd,
  onUpdate,
  editingProduct,
  viewingProduct,
  readOnly,
}) => {
  const [formData, setFormData] = useState<Omit<ProductData, 'id' | 'createdAt' | 'updatedAt'>>({
    name: '',
    price: 0,
    description: '',
  });

  // Seçilen static kategori state'i kaldırıldı
  // const [selectedStaticCategoryId, setSelectedStaticCategoryId] = useState<number | string>('');

  const [errors, setErrors] = useState({
    name: '',
    price: '',
    description: '',
  });

  useEffect(() => {
    if (viewingProduct && readOnly) {
      setFormData({
        name: viewingProduct.name,
        price: viewingProduct.price,
        description: viewingProduct.description || '',
      });
    } else if (editingProduct) {
      setFormData({
        name: editingProduct.name,
        price: editingProduct.price,
        description: editingProduct.description || '',
      });
      // setSelectedStaticCategoryId(''); // Kaldırıldı
    } else {
      setFormData({
        name: '',
        price: 0,
        description: '',
      });
      // setSelectedStaticCategoryId(''); // Kaldırıldı
    }
  }, [editingProduct, viewingProduct, readOnly]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' ? Number(value) : value,
    }));

    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    let tempErrors = {
      name: '',
      price: '',
      description: '',
    };
    let isValid = true;

    if (!formData.name) {
      tempErrors.name = 'Ürün adı zorunludur.';
      isValid = false;
    }
    if (formData.price <= 0) {
      tempErrors.price = 'Fiyat sıfırdan büyük olmalıdır.';
      isValid = false;
    } else if (formData.price > 100000) {
      tempErrors.price = 'Fiyat 100.000 TL\'den fazla olamaz.';
      isValid = false;
    }
    if (!formData.description) {
      tempErrors.description = 'Açıklama zorunludur.';
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('handleSubmit called');
    if (validate()) {
      console.log('Validation passed');

      const dataToSend = {
        name: formData.name,
        price: formData.price,
        description: formData.description,
        // categoryName kaldırıldı
      };
      console.log('[ProductModal] Gönderilecek veri:', dataToSend);

      try {
        if (editingProduct) {
          await onUpdate({ ...editingProduct, ...dataToSend });
        } else {
          await onAdd(dataToSend);
        }
        onClose();
        console.log('Modal closed');
      } catch (error) {
        console.error('Error in handleSubmit:', error);
        // Hata yönetimi burada yapılabilir
      }
    }
  };

  // handleStaticCategoryChange fonksiyonu kaldırıldı
  // const handleStaticCategoryChange = (event: any) => { ... };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ bgcolor: '#1976d2', color: '#fff' }}>
        {editingProduct ? 'Ürünü Güncelle' : 'Yeni Ürün Ekle'}
      </DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2} mt={2}>
            <TextField
              label="Ürün Adı"
              name="name"
              fullWidth
              variant="outlined"
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
              disabled={readOnly}
            />
            <TextField
              label="Fiyat"
              name="price"
              fullWidth
              variant="outlined"
              type="number"
              value={formData.price}
              onChange={handleChange}
              error={!!errors.price}
              helperText={errors.price}
              InputLabelProps={{
                shrink: true,
              }}
              disabled={readOnly}
            />
            {/* Kategori dropdown kaldırıldı */}
            {/* <FormControl fullWidth margin="normal"> ... </FormControl> */}
            <TextField
              label="Açıklama"
              name="description"
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              value={formData.description}
              onChange={handleChange}
              error={!!errors.description}
              helperText={errors.description}
              disabled={readOnly}
            />
          </Stack>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={onClose} variant="outlined" color="inherit">
              İptal
            </Button>
            {!readOnly && (
              <Button type="submit" variant="contained" color="primary">
                {editingProduct ? 'Güncelle' : 'Ekle'}
              </Button>
            )}
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductModal;
