import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import type { ProductData } from '../components/ProductModal';
import ProductModal from '../components/ProductModal';
import { Box, Button, Typography, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, MenuItem, FormControl, InputLabel, Grid, TextField, Pagination } from '@mui/material';
import DefaultLayout from '../layout/DefaultLayout';
import Swal from 'sweetalert2';
import DescriptionModal from '../components/DescriptionModal';

const DESCRIPTION_LIMIT = 50; // Character limit for description (reduced for more space)

const Dashboard = () => {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);
  const [openProductModal, setOpenProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductData | null>(null);
  const [viewingProduct, setViewingProduct] = useState<ProductData | null>(null);
  
  // Sayfalama State'leri
  const [page, setPage] = useState(1); // Mevcut sayfa
  const [limit, setLimit] = useState(10); // Sayfa boyutu
  const [totalProducts, setTotalProducts] = useState(0); // Toplam ürün sayısı

  // Arama ve Sıralama State'leri (Mevcutlar)
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<string>('createdAt'); // Varsayılan sıralama createdAt
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc'); // Varsayılan sıralama DESC

  const [fullDescription, setFullDescription] = useState('');
  const [openDescriptionModal, setOpenDescriptionModal] = useState(false);

  // useEffect, sayfa, limit, arama veya sıralama değiştiğinde ürünleri çeker
  useEffect(() => {
    fetchProducts();
  }, [page, limit, searchQuery, sortBy, sortOrder]); // Bağımlılıklar güncellendi

  // Frontend filtreleme ve sıralama mantığı kaldırıldı
  // useEffect(() => { ... }, [searchQuery, products, sortBy, sortOrder]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Backend API'sine sorgu parametreleriyle istek gönderme
      const response = await axios.get('http://localhost:3000/products', {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        params: { // Sorgu parametreleri
          page,
          limit,
          search: searchQuery,
          sortBy,
          sortOrder: sortOrder.toUpperCase(), // Backend 'ASC' veya 'DESC' bekliyor
        }
      });
      
      // Backend'den gelen data ve total değerlerini alma
      const { data, total } = response.data;

      // Fiyatı string'den sayıya çevir (backend hala string döndürüyor olabilir)
      const productsWithNumbers = data.map((product: ProductData) => ({
        ...product,
        price: Number(product.price)
      }));

      setProducts(productsWithNumbers);
      setTotalProducts(total); // Toplam ürün sayısı state'ini güncelle
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
      // Hata durumunda ürün listesini ve toplam sayıyı sıfırla
      setProducts([]);
      setTotalProducts(0);
    }
  };

  const handleAddProduct = async (newProduct: Omit<ProductData, 'id' | 'createdAt'>) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        Swal.fire('Hata!', 'Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.', 'error');
        handleLogout();
        return;
      }

      const dataToSend = {
        name: newProduct.name,
        price: newProduct.price,
        description: newProduct.description,
      };

      await axios.post('http://localhost:3000/products', dataToSend, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      await Swal.fire({
        icon: 'success',
        title: 'Başarılı!',
        text: 'Ürün başarıyla eklendi.',
        timer: 1500
      });

      // Ürün eklendikten sonra ilk sayfayı yeniden çek
      setPage(1); // Sayfayı sıfırla
      fetchProducts(); // Veriyi yeniden çek
      setOpenProductModal(false);
    } catch (error: any) {
      console.error('Error adding product:', error);
      let errorMessage = 'Ürün eklenirken bir hata oluştu.';

      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = 'Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.';
          handleLogout();
        } else if (error.response.data && typeof error.response.data.message === 'string') {
           errorMessage = error.response.data.message;
        } else if (error.response.data && Array.isArray(error.response.data.message)) {
          errorMessage = 'Lütfen şu hataları düzeltin:\n' + error.response.data.message.join('\n');
        }
      }

      Swal.fire({
        icon: 'error',
        title: 'Hata!',
        text: errorMessage,
        preConfirm: () => {
          if (error.response?.status === 401) {
            return true;
          }
          return true;
        }
      });
    }
  };

  const handleUpdateProduct = async (updatedProduct: ProductData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        Swal.fire('Hata!', 'Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.', 'error');
        handleLogout();
        return;
      }

      const dataToSend = {
        name: updatedProduct.name,
        price: updatedProduct.price,
        description: updatedProduct.description,
      };

      await axios.put(
        `http://localhost:3000/products/${updatedProduct.id}`,
        dataToSend,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      await Swal.fire({
        icon: 'success',
        title: 'Başarılı!',
        text: 'Ürün başarıyla güncellendi.',
        timer: 1500
      });

      // Ürün güncellendikten sonra mevcut sayfayı yeniden çek
      fetchProducts(); // Veriyi yeniden çek (mevcut sayfa korunur)
      setEditingProduct(null);
    } catch (error: any) {
      console.error('Error updating product:', error);
      let errorMessage = 'Ürün güncellenirken bir hata oluştu.';

      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = 'Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.';
          handleLogout();
        } else if (error.response.data && typeof error.response.data.message === 'string') {
           errorMessage = error.response.data.message;
        } else if (error.response.data && Array.isArray(error.response.data.message)) {
          errorMessage = 'Lütfen şu hataları düzeltin:\n' + error.response.data.message.join('\n');
        }
      }

      Swal.fire({
        icon: 'error',
        title: 'Hata!',
        text: errorMessage,
         preConfirm: () => {
          if (error.response?.status === 401) {
            return true;
          }
          return true;
        }
      });
    }
  };

  const handleDeleteProduct = async (id: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        Swal.fire('Hata!', 'Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.', 'error');
        handleLogout();
        return;
      }

      const confirmResult = await Swal.fire({
        title: 'Emin misin?',
        text: 'Bu ürünü silersen bir daha geri dönüşü yok',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Evet, sil!',
        cancelButtonText: 'İptal',
        allowOutsideClick: false,
        allowEscapeKey: false,
      });

      if (confirmResult.isConfirmed) {
        await axios.delete(`http://localhost:3000/products/${id}`, {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        await Swal.fire({
          icon: 'success',
          title: 'Silindi!',
          text: 'Ürün başarıyla silindi.',
          timer: 1500,
          showConfirmButton: false
        });
        
        // Ürün silindikten sonra mevcut sayfayı yeniden çek
        fetchProducts(); // Veriyi yeniden çek (mevcut sayfa korunur)
      }
    } catch (error: any) {
      console.error('Error deleting product:', error);
      let errorMessage = 'Ürün silinirken bir hata oluştu.';

      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = 'Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.';
          handleLogout();
        } else if (error.response.data && typeof error.response.data.message === 'string') {
           errorMessage = error.response.data.message;
        } else if (error.response.data && Array.isArray(error.response.data.message)) {
          errorMessage = 'Lütfen şu hataları düzeltin:\n' + error.response.data.message.join('\n');
        }
      }

      Swal.fire({
        icon: 'error',
        title: 'Hata!',
        text: errorMessage,
          preConfirm: () => {
          if (error.response?.status === 401) {
            return true;
          }
          return true;
        }
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/'; // Login sayfasına yönlendirme
  };

  // Arama inputu değiştiğinde
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
    setPage(1); // Arama değiştiğinde sayfayı sıfırla
  };

  // Sıralama seçeneği değiştiğinde
  const handleSortChange = (event: any) => {
    const [field, direction] = (event.target.value as string).split('-');
    setSortBy(field);
    setSortOrder(direction as 'asc' | 'desc');
    setPage(1); // Sıralama değiştiğinde sayfayı sıfırla
  };

  // Sayfa değiştiğinde
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleOpenDescriptionModal = (description: string) => {
    setFullDescription(description);
    setOpenDescriptionModal(true);
  };

  const handleCloseDescriptionModal = () => {
    setOpenDescriptionModal(false);
    setFullDescription('');
  };

  // Toplam sayfa sayısını hesapla
  const totalPages = Math.ceil(totalProducts / limit);

  // Ürün detaylarını çekme fonksiyonu
  const handleViewDetails = async (id: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        Swal.fire('Hata!', 'Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.', 'error');
        handleLogout();
        return;
      }

      const response = await axios.get(`http://localhost:3000/products/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setViewingProduct(response.data);
      setOpenProductModal(true); // Modalı aç
    } catch (error: any) {
      console.error('Error fetching product details:', error);
      let errorMessage = 'Ürün detayları çekilirken bir hata oluştu.';
      if (error.response?.status === 404) {
        errorMessage = 'Ürün bulunamadı.';
      } else if ((error as any).response?.status === 401) {
         errorMessage = 'Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.';
         handleLogout();
      } else if ((error as any).response?.data?.message) {
         errorMessage = (error as any).response.data.message;
      }
      Swal.fire('Hata!', errorMessage, 'error');
    }
  };

  return (
    <DefaultLayout onLogout={handleLogout} onSearch={(query) => setSearchQuery(query)}>
      <Box sx={{ p: 2 }}>
        <Box sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: 2,
          alignItems: 'center',
          mb: 2
        }}>
          <Box>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={() => setOpenProductModal(true)}
            >
              + Ürün Ekle
            </Button>
          </Box>
          <Box sx={{ flexGrow: 1 }}>
            <FormControl variant="outlined" size="small" sx={{ minWidth: 180, mr: 2 }}>
              <InputLabel>Sıralama</InputLabel>
              <Select
                value={`${sortBy}-${sortOrder}`}
                label="Sıralama"
                onChange={handleSortChange}
              >
                <MenuItem value="name-asc">İsim (A-Z)</MenuItem>
                <MenuItem value="name-desc">İsim (Z-A)</MenuItem>
                <MenuItem value="price-asc">Fiyat (Düşük-Yüksek)</MenuItem>
                <MenuItem value="price-desc">Fiyat (Yüksek-Düşük)</MenuItem>
                <MenuItem value="createdAt-desc">Tarih (Yeni-Eski)</MenuItem>
                <MenuItem value="createdAt-asc">Tarih (Eski-Yeni)</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box>
            {products.length === 0 && searchQuery !== '' ? (
              <Typography variant="h6" textAlign="center">Ürün bulunamadı</Typography>
            ) : products.length === 0 && searchQuery === '' ? (
               <Typography variant="h6" textAlign="center">Henüz ürün eklenmemiş.</Typography>
            ) : (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Ürün Adı</TableCell>
                      <TableCell>Fiyat</TableCell>
                      <TableCell>Açıklama</TableCell>
                      <TableCell>Tarih</TableCell>
                      <TableCell align="right">İşlemler</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {products.map((product: ProductData) => (
                      <TableRow key={product.id}>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>{product.price} ₺</TableCell>
                        <TableCell>
                          {product.description && product.description.length > DESCRIPTION_LIMIT ? (
                            <>
                              {`${product.description.substring(0, DESCRIPTION_LIMIT)}...`}
                              <Typography
                                component="span"
                                sx={{ color: 'blue', cursor: 'pointer', ml: 0.5 }}
                                onClick={() => handleOpenDescriptionModal(product.description!)}
                              >
                                Devamı oku
                              </Typography>
                            </>
                          ) : (
                            product.description
                          )}
                        </TableCell>
                        <TableCell>{new Date(product.createdAt!).toLocaleDateString()}</TableCell>
                        <TableCell sx={{ pr: 2, display: 'flex', justifyContent: 'flex-end' }}>
                          <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} alignItems="flex-end" gap={1}>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => handleViewDetails(product.id!)}
                            >
                              Detayları Görüntüle
                            </Button>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => {
                                setEditingProduct(product);
                                setOpenProductModal(true);
                              }}
                            >
                              Düzenle
                            </Button>
                            <Button
                              variant="outlined"
                              color="error"
                              size="small"
                              onClick={() => handleDeleteProduct(product.id!)}
                            >
                              Sil
                            </Button>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                />
              </Box>
            )}
          </Box>
        )}

        {openProductModal && (
          <ProductModal
            open={openProductModal}
            onClose={() => {
              setOpenProductModal(false);
              setEditingProduct(null);
              setViewingProduct(null); // Viewing state'ini de temizle
              fetchProducts();
            }}
            onAdd={handleAddProduct}
            onUpdate={handleUpdateProduct}
            editingProduct={editingProduct}
            viewingProduct={viewingProduct} // Yeni prop eklendi
            readOnly={!!viewingProduct} // viewingProduct varsa readonly true olacak
          />
        )}

        <DescriptionModal
          open={openDescriptionModal}
          onClose={handleCloseDescriptionModal}
          description={fullDescription}
        />
      </Box>
    </DefaultLayout>
  );
};

export default Dashboard;
