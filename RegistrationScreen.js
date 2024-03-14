import { Input } from 'react-native-elements';

const RegistrationScreen = () => {
  return (
    <>
      <Input testID="firstname" />
      <Input testID="lastname" />
      <Input testID="username" />
      <Input testID="phonenumber" />
      <Input testID="password" secureTextEntry />
      <Input testID="confirmpassword" secureTextEntry />
      <Input testID="email" />
      <Input testID="zip" />
      <Input testID="newsletter" type="checkbox" />
      <Button testID="register-button" title="Register" disabled={/* condition for disabling */} />
    </>
  );
};

export default RegistrationScreen;