import { Input } from 'react-native-elements';

const LoginScreen = () => {
  return (
    <>
      <Input testID="login-username" />
      <Input testID="login-password" secureTextEntry />
      <Button testID="login-button" title="Login" />
      <Button testID="login-register" title="Register" />
    </>
  );
};

export default LoginScreen;