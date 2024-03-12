// App.js
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import TodoScreen from './TodoScreen';
import LoginScreen from './LoginScreen';
import RegistrationScreen from './RegistrationScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Todo" component={TodoScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Registration" component={RegistrationScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// LoginScreen.js
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Input, Button } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const loginData = await AsyncStorage.getItem('loginData');
      const users = loginData ? JSON.parse(loginData) : [];
      const user = users.find(
        (user) => user.username === username && user.password === password
      );

      if (user) {
        navigation.navigate('Todo');
      } else {
        alert('Invalid username or password');
      }
    } catch (error) {
      console.log('Error retrieving login data:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Input
        testID="login-username"
        label="Username"
        value={username}
        onChangeText={setUsername}
      />
      <Input
        testID="login-password"
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button
        testID="login-button"
        title="Login"
        onPress={handleLogin}
        buttonStyle={styles.button}
      />
      <Button
        testID="login-register"
        title="Register"
        onPress={() => navigation.navigate('Registration')}
        buttonStyle={styles.button}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  button: {
    marginVertical: 10,
  },
});

export default LoginScreen;

// RegistrationScreen.js
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Input, Button, CheckBox } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RegistrationScreen = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [newsletter, setNewsletter] = useState(false);

  const [errors, setErrors] = useState({});

  const handleRegister = async () => {
    // Validate input fields
    const errors = validateInputs();

    if (Object.keys(errors).length === 0) {
      // Store the user data in AsyncStorage
      try {
        const loginData = await AsyncStorage.getItem('loginData');
        const users = loginData ? JSON.parse(loginData) : [];
        const newUser = { username, password };
        const updatedUsers = [...users, newUser];
        await AsyncStorage.setItem('loginData', JSON.stringify(updatedUsers));
        alert('Registration successful!');
      } catch (error) {
        console.log('Error storing user data:', error);
      }
    } else {
      setErrors(errors);
    }
  };

  const validateInputs = () => {
    let errors = {};

    // Phone Number validation
    const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;
    if (!phoneRegex.test(phoneNumber)) {
      errors.phoneNumber = 'Error: Phone number must be in the format (xxx) xxx-xxxx';
    }

    // Email validation
    const emailRegex = /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/;
    if (!emailRegex.test(email)) {
      errors.email = 'Error: Invalid email address';
    }

    // Password validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      errors.password = 'Error: Password must contain at least one uppercase letter, one lowercase letter, one number, and one non-alphanumeric character';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Error: Passwords do not match';
    }

    // First Name and Last Name validation
    const nameRegex = /^[^\d=?\\/@#%^&*()]+$/;
    if (!nameRegex.test(firstName)) {
      errors.firstName = 'Error: First name must not contain numbers';
    }
    if (!nameRegex.test(lastName)) {
      errors.lastName = 'Error: Last name must not contain numbers';
    }

    // ZIP Code validation
    const zipRegex = /^\d{5}$/;
    if (!zipRegex.test(zipCode)) {
      errors.zipCode = 'Error: ZIP code must be 5 digits';
    }

    return errors;
  };

  const isFormValid = () => {
    const errors = validateInputs();
    return (
      firstName.trim() !== '' &&
      lastName.trim() !== '' &&
      username.trim() !== '' &&
      phoneNumber.trim() !== '' &&
      password.trim() !== '' &&
      confirmPassword.trim() !== '' &&
      email.trim() !== '' &&
      zipCode.trim() !== '' &&
      Object.keys(errors).length === 0
    );
  };

  return (
    <View style={styles.container}>
      <Input
        testID="firstname"
        label="First Name"
        value={firstName}
        onChangeText={setFirstName}
        errorMessage={errors.firstName}
      />
      <Input
        testID="lastname"
        label="Last Name"
        value={lastName}
        onChangeText={setLastName}
        errorMessage={errors.lastName}
      />
      <Input
        testID="username"
        label="Username"
        value={username}
        onChangeText={setUsername}
      />
      <Input
        testID="phonenumber"
        label="Phone Number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        errorMessage={errors.phoneNumber}
      />
      <Input
        testID="password"
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        errorMessage={errors.password}
      />
      <Input
        testID="confirmpassword"
        label="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        errorMessage={errors.confirmPassword}
      />
      <Input
        testID="email"
        label="Email"
        value={email}
        onChangeText={setEmail}
        errorMessage={errors.email}
      />
      <Input
        testID="zip"
        label="ZIP Code"
        value={zipCode}
        onChangeText={setZipCode}
        errorMessage={errors.zipCode}
      />
      <CheckBox
        testID="newsletter"
        title="Sign up for newsletter"
        checked={newsletter}
        onPress={() => setNewsletter(!newsletter)}
      />
      <Button
        testID="register-button"
        title="Register"
        onPress={handleRegister}
        disabled={!isFormValid()}
        buttonStyle={styles.button}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  button: {
    marginVertical: 10,
  },
});

export default RegistrationScreen;
