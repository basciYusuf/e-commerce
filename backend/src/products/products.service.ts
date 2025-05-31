import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Product } from './product.entity';

// Sorgu parametreleri için interface tanımlayalım
export interface FindAllQueryParams {
  page?: number; // Sayfa numarası (varsayılan 1)
  limit?: number; // Sayfa boyutu (varsayılan 10)
  search?: string; // Arama terimi
  sortBy?: string; // Sıralama alanı
  sortOrder?: 'ASC' | 'DESC'; // Sıralama yönü
}

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async findAll(params: FindAllQueryParams): Promise<{ data: Product[]; total: number }> {
    const { page = 1, limit = 10, search, sortBy, sortOrder = 'ASC' } = params;
    const skip = (page - 1) * limit;

    const queryBuilder = this.productRepository.createQueryBuilder('product');

    // Arama filtresi
    if (search) {
      queryBuilder.where(
        'LOWER(product.name) LIKE :search OR LOWER(product.description) LIKE :search', // Hem isim hem açıklamada arama
        { search: `%${search.toLowerCase()}%` }
      );
    }

    // Sıralama
    if (sortBy) {
      queryBuilder.orderBy(`product.${sortBy}`, sortOrder);
    } else {
       // Varsayılan sıralama (örneğin ID veya createdAt)
       queryBuilder.orderBy('product.createdAt', 'DESC');
    }

    queryBuilder.offset(skip).limit(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return { data, total };
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException('Ürün bulunamadı');
    }
    return product;
  }

  create(data: Partial<Product>): Promise<Product> {
    const product = this.productRepository.create(data);
    return this.productRepository.save(product);
  }

  async update(id: number, data: Partial<Product>): Promise<Product> {
    const product = await this.findOne(id);
    Object.assign(product, data);
    return this.productRepository.save(product);
  }

  async remove(id: number): Promise<void> {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
  }
}
