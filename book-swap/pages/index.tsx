import { Box, Button, FormControl, FormErrorMessage, FormLabel, Input, Stack } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { auth } from "../app/firebase";
import {signInWithEmailAndPassword} from "firebase/auth";
import AuthDetails from '@/app/AuthDetails';
import router, { useRouter } from 'next/router';
import { Url } from 'next/dist/shared/lib/router/router';

const LoginPage = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const onSubmit = (data: any) => {
    const { email, password } = data;
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(userCredential)
      }).catch((error) => {
        console.log(error)
      })
  };
  

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      bg="gray.100"
    >
      <Box bg="white" p={8} borderRadius="md" boxShadow="lg">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={4}>
            <FormControl isInvalid={!!errors.email} isRequired>
              <FormLabel>Email</FormLabel>
              <Input type="email" placeholder="Enter your email" autoComplete="off" {...register('email', { required: 'Email is required' })} />
              <FormErrorMessage>{errors.email && errors.email.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.password} isRequired>
              <FormLabel>Password</FormLabel>
              <Input type="password" placeholder="Password" autoComplete="off" {...register('password', { required: 'Password is required' })}/>
              <FormErrorMessage>{errors.password && errors.password.message}</FormErrorMessage>
            </FormControl>

            <Button type="submit" colorScheme="blue" width="full">
              Login
            </Button>

            <Button type="submit" onClick={() => {router.push('/signup')}} colorScheme="blue" width="full">
              SignUp
            </Button>
          </Stack>
        </form>
      </Box>
      <AuthDetails />
    </Box>
  );
};

export default LoginPage;
