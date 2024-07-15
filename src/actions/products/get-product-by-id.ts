import {tesloApi} from '../../config/api/tesloApi';
import {Gender, Product} from '../../domain/entities/product';
import {TesloProduct} from '../../infrastructure/interfaces/teslo-products.response';
import {ProductMaper} from '../../infrastructure/mappers/products.mapper';

const emptyProduct: Product = {
  id: '',
  title: 'Nuevo Producto',
  description: '',
  price: 0,
  images: [],
  slug: '',
  gender: Gender.Unisex,
  sizes: [],
  stock: 0,
  tags: [],
};

export const getProductById = async (id: string): Promise<Product> => {
  if (id === 'new') return emptyProduct;
  try {
    const {data} = await tesloApi.get<TesloProduct>(`/products/${id}`);
    return ProductMaper.tesloProductToEntity(data);
  } catch (error) {
    console.log(error);
    throw new Error('Error al obtener el producto');
  }
};
