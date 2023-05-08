import { Box, Button, FormControl, FormErrorMessage, FormLabel, Input, Stack } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';

const LoginPage = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const onSubmit = (data: any) => {
    // Perform login logic here
    console.log(data);
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
            <FormControl isInvalid={!!errors.username} isRequired>
              <FormLabel>Username</FormLabel>
              <Input type="text" {...register('username', { required: 'Username is required' })} />
              <FormErrorMessage>{errors.username && errors.username.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.password} isRequired>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                {...register('password', { required: 'Password is required' })}
              />
              <FormErrorMessage>{errors.password && errors.password.message}</FormErrorMessage>
            </FormControl>

            <Button type="submit" colorScheme="blue" width="full">
              Login
            </Button>
          </Stack>
        </form>
      </Box>
    </Box>
  );
};

export default LoginPage;
