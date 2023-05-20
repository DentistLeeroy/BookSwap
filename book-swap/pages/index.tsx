import React, { useState } from 'react';
import { Box, Button, Flex, FormControl, FormErrorMessage, FormLabel, Input, Stack } from '@chakra-ui/react';
import { ChakraProvider } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { Auth, getAuth, sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth';
import AuthDetails from '../app/firebase/server/AuthDetails';
import { useRouter } from 'next/router';

const auth = getAuth();

const LoginPage = () => {
  const router = useRouter();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const [loginError, setLoginError] = useState('');
  const [resetEmail, setResetEmail] = useState('');

  const onSubmit = (data: { email: string; password: string }) => {
    const { email, password } = data;
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(userCredential);
        router.push('/profile');
      })
      .catch((error) => {
        console.log(error);
        setLoginError('Invalid credentials. Please try again.');
      });
  };

  const handleResetPassword = () => {
    if (resetEmail) {
      const auth = getAuth();
      sendPasswordResetEmail(auth, resetEmail)
        .then(() => {
          console.log('Password reset email sent');
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return (
    <ChakraProvider>
      <Flex width="100vw" height="100vh" justifyContent="center" alignItems="center" bg="gray.100">
        <Box bg="white" p={8} borderRadius="md" boxShadow="lg">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={4}>
              <FormControl isInvalid={!!errors.email} isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  autoComplete="off"
                  {...register('email', { required: 'Email is required' })}
                />
                <FormErrorMessage>{errors.email && errors.email.message}</FormErrorMessage>
              </FormControl>
  
              <FormControl isInvalid={!!errors.password} isRequired>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  placeholder="Password"
                  autoComplete="off"
                  {...register('password', { required: 'Password is required' })}
                />
                <FormErrorMessage>{errors.password && errors.password.message}</FormErrorMessage>
              </FormControl>
  
              {loginError && <p style={{ color: 'red' }}>{loginError}</p>}
  
              <Button type="submit" colorScheme="blue" width="full">
                Login
              </Button>
  
              <Button type="button" onClick={() => router.push('/signup')} colorScheme="blue" width="full">
                SignUp
              </Button>
  
              <Stack spacing={4}>
                <p>Email</p>
                <Input
                  className="resetEmailInput"
                  placeholder="Email"
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                />
                <Button className="resetBtn" type="button" onClick={handleResetPassword} colorScheme="blue">
                  Reset password
                </Button>
              </Stack>
            </Stack>
          </form>
        </Box>
        <AuthDetails />
      </Flex>
    </ChakraProvider>
  );   
};

export default LoginPage;
