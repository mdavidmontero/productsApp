import React, {useRef} from 'react';
import {MainLayout} from '../../layouts/MainLayout';
import {
  Button,
  ButtonGroup,
  Input,
  Layout,
  useTheme,
} from '@ui-kitten/components';
import {Formik} from 'formik';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParams} from '../../navigation/StackNavigator';
import {getProductById, updateCreateProduct} from '../../../actions/products';
import {ScrollView} from 'react-native-gesture-handler';
import {Product} from '../../../domain/entities/product';
import {MyIcon} from '../../components/ui/MyIcon';
import {ProductImages} from '../../components/products/ProductImages';
import {genders, sizes} from '../../../config/constants/constants';

interface Props extends StackScreenProps<RootStackParams, 'ProductScreen'> {}
export const ProductScreen = ({route}: Props) => {
  const productIdRef = useRef(route.params.productId);
  const queryClient = useQueryClient();
  const theme = useTheme();
  // Usequery
  const {data: product} = useQuery({
    queryKey: ['product', productIdRef.current],
    queryFn: () => getProductById(productIdRef.current),
  });

  // useMutation
  const mutation = useMutation({
    mutationFn: (data: Product) =>
      updateCreateProduct({...data, id: productIdRef.current}),
    onSuccess: (data: Product) => {
      productIdRef.current = data.id;
      queryClient.invalidateQueries({queryKey: ['products', 'infinite']});
      queryClient.invalidateQueries({queryKey: ['product', data.id]});
    },
  });

  if (!product) {
    return <MainLayout title="Cargando..." />;
  }
  return (
    <Formik initialValues={product} onSubmit={mutation.mutate}>
      {({handleChange, handleSubmit, values, errors, setFieldValue}) => (
        <MainLayout title={values.title} subTitle={`Precio ${values.price}`}>
          <ScrollView style={{flex: 1}}>
            {/* Imagenes de Productos */}
            <Layout
              style={{
                marginVertical: 10,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <ProductImages images={values.images} />
            </Layout>
            {/* Formulario */}
            <Layout style={{marginHorizontal: 10}}>
              <Input
                label={'Titulo'}
                style={{marginVertical: 5}}
                value={values.title}
                onChangeText={handleChange('title')}
              />
              <Input
                label={'Slug'}
                value={values.slug}
                style={{marginVertical: 5}}
                onChangeText={handleChange('slug')}
              />
              <Input
                label={'Descripción'}
                value={values.description}
                multiline
                numberOfLines={5}
                style={{marginVertical: 5}}
                onChangeText={handleChange('description')}
              />
            </Layout>
            {/* Precio e inventario */}
            <Layout
              style={{
                marginVertical: 5,
                marginHorizontal: 15,
                flexDirection: 'row',
                gap: 10,
              }}>
              <Input
                label={'Precio'}
                value={values.price.toString()}
                onChangeText={handleChange('price')}
                style={{flex: 1}}
              />
              <Input
                label={'Inventario'}
                value={values.stock.toString()}
                onChangeText={handleChange('stock')}
                style={{flex: 1}}
              />
            </Layout>

            {/* Selectores */}
            <ButtonGroup
              style={{margin: 2, marginHorizontal: 15, marginTop: 20}}
              size="small"
              appearance="outline">
              {sizes.map(size => (
                <Button
                  onPress={() =>
                    setFieldValue(
                      'sizes',
                      values.sizes.includes(size)
                        ? values.sizes.filter(s => s !== size)
                        : [...values.sizes, size],
                    )
                  }
                  key={size}
                  style={{
                    flex: 1,
                    backgroundColor: values.sizes.includes(size)
                      ? theme[`color-primary-200`]
                      : undefined,
                  }}>
                  {size}
                </Button>
              ))}
            </ButtonGroup>

            <ButtonGroup
              style={{margin: 2, marginHorizontal: 15, marginTop: 20}}
              size="small"
              appearance="outline">
              {genders.map(gender => (
                <Button
                  onPress={() => setFieldValue('gender', gender)}
                  style={{
                    flex: 1,
                    backgroundColor: values.gender.startsWith(gender)
                      ? theme[`color-primary-200`]
                      : undefined,
                  }}
                  key={gender}>
                  {gender}
                </Button>
              ))}
            </ButtonGroup>
            {/* Botones */}
            <Button
              accessoryLeft={<MyIcon name="save-outline" white />}
              style={{margin: 15}}
              onPress={() => handleSubmit()}>
              Guardar
            </Button>

            <Layout style={{height: 200}} />
          </ScrollView>
        </MainLayout>
      )}
    </Formik>
  );
};
