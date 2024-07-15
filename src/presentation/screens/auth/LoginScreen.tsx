import {Input, Layout, Text, Button} from '@ui-kitten/components';
import {Alert, ScrollView, useWindowDimensions} from 'react-native';
import {MyIcon} from '../../components/ui/MyIcon';
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParams} from '../../navigation/StackNavigator';
import {useState} from 'react';
import {useAuthStore} from '../../store/auth/useAuthStore';

interface Props extends StackScreenProps<RootStackParams, 'LoginScreen'> {}

export const LoginScreen = ({navigation}: Props) => {
  const {login} = useAuthStore();
  const [isPosting, setisPosting] = useState(false);
  const [form, setForm] = useState({email: '', password: ''});
  const {height} = useWindowDimensions();

  const onLogin = async () => {
    if (form.email.length === 0 || form.password.length === 0) {
      return;
    }

    setisPosting(true);
    const wasSuccessful = await login(form.email, form.password);
    if (wasSuccessful) return;
    setisPosting(false);
    Alert.alert('Error', 'Usuario o Contraseña Incorrectos');
  };

  return (
    <Layout style={{flex: 1}}>
      <ScrollView style={{marginHorizontal: 40}}>
        <Layout style={{paddingTop: height * 0.35}}>
          <Text category="h1">Ingresar</Text>
          <Text category="p2">Por favor Ingrese para continuar</Text>
        </Layout>

        {/* Inputs */}
        <Layout style={{marginTop: 20}}>
          <Input
            placeholder="Correo Electronico"
            style={{marginBottom: 10}}
            autoCapitalize="none"
            value={form.email}
            onChangeText={email => setForm({...form, email})}
            keyboardType="email-address"
            accessoryLeft={<MyIcon name="email-outline" />}
          />
          <Input
            placeholder="Contraseña"
            accessoryLeft={<MyIcon name="lock-outline" />}
            autoCapitalize="none"
            value={form.password}
            onChangeText={password => setForm({...form, password})}
            secureTextEntry={true}
            style={{marginBottom: 10}}
          />

          {/* Space */}
          <Layout style={{height: 10}} />

          <Layout>
            <Button
              disabled={isPosting}
              onPress={onLogin}
              appearance="filled"
              accessoryRight={<MyIcon name="arrow-forward-outline" white />}>
              Ingresar
            </Button>
          </Layout>
          <Layout style={{height: 50}} />
          <Layout
            style={{
              alignItems: 'flex-end',
              flexDirection: 'row',
              justifyContent: 'center',
            }}>
            <Text>No tienes cuenta?</Text>
            <Text
              status="primary"
              category="s1"
              onPress={() => navigation.navigate('RegisterScreen')}>
              {' '}
              crea una
            </Text>
          </Layout>
        </Layout>
      </ScrollView>
    </Layout>
  );
};
