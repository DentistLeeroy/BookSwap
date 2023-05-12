import { Box, Button, FormControl, FormErrorMessage, FormLabel, Input, Stack, Text } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { auth } from "../app/firebase/server/firebase";
import { createUserWithEmailAndPassword, getAuth, fetchSignInMethodsForEmail } from "firebase/auth";
import AuthDetails from '../app/firebase/server/AuthDetails';
import { firestore } from "../app/firebase/server/firebase";
import router, { useRouter } from 'next/router';

const SignUp = () => {
  const router = useRouter();
  const {
    handleSubmit,
    register,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm();

  const onSubmit = async (data: any) => {
    const { email, password } = data;
    const authInstance = getAuth();
    try {
      const signInMethods = await fetchSignInMethodsForEmail(authInstance, email);
      if (signInMethods.length > 0) {
        setError('email', { type: 'manual', message: 'Username already exists' });
      } else {
        createUserWithEmailAndPassword(authInstance, email, password)
          .then((userCredential) => {
            console.log(userCredential);
            router.push('/profile');
          })
          .catch((error) => {
            console.log(error);
          });
      }
    } catch (error) {
      console.log(error);
    }
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
              <Input
                type="email"
                placeholder="Enter your email"
                autoComplete="off"
                {...register('email', { required: 'Email is required' })}
                onFocus={() => clearErrors('email')}
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

            {errors.email && (
              <Text color="red" fontSize="sm">
                {errors.email.message}
              </Text>
            )}

            <Button type="submit" colorScheme="blue" width="full">
              Sign Up
            </Button>
          </Stack>
        </form>
      </Box>
    </Box>
  );
};

export default SignUp;
