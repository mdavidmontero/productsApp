import {Input, Layout, Text, Button} from '@ui-kitten/components';
import {Alert, ScrollView, useWindowDimensions} from 'react-native';
import {MyIcon} from '../../components/ui/MyIcon';
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParams} from '../../navigation/StackNavigator';
import {useState} from 'react';
import {useAuthStore} from '../../store/auth/useAuthStore';

interface Props extends StackScreenProps<RootStackParams, 'RegisterScreen'> {}

export const RegisterScreen = ({navigation}: Props) => {
  const {register} = useAuthStore();
  const {height} = useWindowDimensions();
  const [isPosting, setIsPosting] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
  });

  const onRegister = async () => {
    if (
      form.email.length === 0 ||
      form.password.length === 0 ||
      form.password.length === 0
    ) {
      return;
    }
    console.log('ckick');
    setIsPosting(true);
    const wasSuccessful = await register(
      form.fullName,
      form.email,
      form.password,
    );
    console.log(wasSuccessful);
    if (wasSuccessful) {
      navigation.navigate('LoginScreen');
      return;
    }
    setIsPosting(false);
    Alert.alert('Error en el registro, intente nuevamente..');
  };

  return (
    <Layout style={{flex: 1}}>
      <ScrollView style={{marginHorizontal: 40}}>
        <Layout style={{paddingTop: height * 0.3}}>
          <Text category="h1">Crear Cuenta</Text>
          <Text category="p2">Por favor crea una cuenta para continuar</Text>
        </Layout>

        {/* Inputs */}
        <Layout style={{marginTop: 20}}>
          <Input
            placeholder="Nombre Completo"
            accessoryLeft={<MyIcon name="person-outline" />}
            style={{marginBottom: 10}}
            value={form.fullName}
            onChangeText={fullName => setForm({...form, fullName})}
            keyboardType="email-address"
          />
          <Input
            placeholder="Correo Electronico"
            accessoryLeft={<MyIcon name="email-outline" />}
            style={{marginBottom: 10}}
            keyboardType="email-address"
            value={form.email}
            onChangeText={email => setForm({...form, email})}
            autoCapitalize="none"
          />
          <Input
            placeholder="Contraseña"
            accessoryLeft={<MyIcon name="lock-outline" />}
            autoCapitalize="none"
            secureTextEntry={true}
            style={{marginBottom: 10}}
            value={form.password}
            onChangeText={password => setForm({...form, password})}
          />
          {/* Space */}
          <Layout style={{height: 10}} />

          <Layout>
            <Button
              onPress={onRegister}
              disabled={isPosting}
              appearance="filled"
              accessoryRight={<MyIcon name="arrow-forward-outline" white />}>
              Crear
            </Button>
          </Layout>
          <Layout style={{height: 50}} />
          <Layout
            style={{
              alignItems: 'flex-end',
              flexDirection: 'row',
              justifyContent: 'center',
            }}>
            <Text>Ya tienes una Cuenta?</Text>
            <Text
              status="primary"
              category="s1"
              onPress={() => navigation.pop()}>
              {' '}
              Ingresar
            </Text>
          </Layout>
        </Layout>
      </ScrollView>
    </Layout>
  );
};
