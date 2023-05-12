import { Box, Button, Checkbox, VStack, FormControl, FormErrorMessage, Menu, MenuButton, MenuList, MenuItem, FormLabel, Input, Stack, Text, Textarea, Select, CheckboxGroup, MenuItemOption, MenuOptionGroup, Divider, MenuDivider } from '@chakra-ui/react';
import { ChakraProvider } from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
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
    <ChakraProvider>
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
                <FormErrorMessage>{errors.email && errors.email.message?.toString()}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.password} isRequired>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  placeholder="Password"
                  autoComplete="off"
                  {...register('password', { required: 'Password is required' })}
                />
                <FormErrorMessage>{errors.password && errors.password.message?.toString()}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.password} isRequired>
                <FormLabel>Profile name</FormLabel>
                <Input
                  type="text"
                  placeholder=""
                  autoComplete="off"
                  {...register('text', { required: 'Profile name is required' })}
                />
                <FormErrorMessage>{errors.password && errors.password.message?.toString()}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.password} isRequired>
                <FormLabel>Profile description</FormLabel>
                <Textarea
                  placeholder=""
                  autoComplete="off"
                  {...register('text', { required: 'Profile description is required' })}
                />
                <FormErrorMessage>{errors.password && errors.password.message?.toString()}</FormErrorMessage>
              </FormControl>
              <Menu closeOnSelect={false}>
                <MenuButton as={Button} colorScheme='blue'>
                  Select Genres
                </MenuButton>
                <MenuList minWidth='240px'>
                  <MenuOptionGroup title='Select Genres' type='checkbox'>
                    <MenuItemOption value='1'>Politics</MenuItemOption>
                    <MenuItemOption value='2'>Poetry</MenuItemOption>
                    <MenuItemOption value='3'>Romance</MenuItemOption>
                    <MenuItemOption value='4'>Historical</MenuItemOption>
                  </MenuOptionGroup>
                </MenuList>
              </Menu>

              {errors.email && (
                <Text color="red" fontSize="sm">
                  {errors.email.message?.toString()}
                </Text>
              )}

              <Button type="submit" colorScheme="blue" width="full">
                Sign Up
              </Button>
            </Stack>
          </form>
        </Box>
      </Box>
    </ChakraProvider>
  );
};

export default SignUp;
