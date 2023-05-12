import {
    Box,
    Button,
    Checkbox,
    VStack,
    FormControl,
    FormErrorMessage,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    FormLabel,
    Input,
    Stack,
    Text,
    Textarea,
    Select,
    CheckboxGroup,
    MenuItemOption,
    MenuOptionGroup,
    Divider,
    MenuDivider
} from '@chakra-ui/react';
import {ChakraProvider} from '@chakra-ui/react';
import {useForm} from 'react-hook-form';
import {createUserWithEmailAndPassword, getAuth, fetchSignInMethodsForEmail} from "firebase/auth";
import AuthDetails from '../app/firebase/server/AuthDetails';
import {firestore, doc, setDoc, collection} from "../app/firebase/server/firebase";
import router, {useRouter} from 'next/router';
import { useState } from 'react';


const SignUp = () => {
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);


    const router = useRouter();
    const {
        handleSubmit,
        register,
        formState: {
            errors
        },
        setError,
        clearErrors
    } = useForm();

    const onSubmit = async (data : any) => {
        const {email, password, profileName, profileDescription} = data;
        const authInstance = getAuth();
        try {
            const signInMethods = await fetchSignInMethodsForEmail(authInstance, email);
            if (signInMethods.length > 0) {
                setError('email', {
                    type: 'manual',
                    message: 'Username already exists'
                });
            } else {
                createUserWithEmailAndPassword(authInstance, email, password).then(async (userCredential) => {
                    const user = userCredential.user;
                    const userProfile = {
                        name: profileName || '', // Ensure a valid value or use an empty string as fallback
                        description: profileDescription || '', // Ensure a valid value or use an empty string as fallback
                        interests: selectedGenres || [] // You can add interests here if available in the form
                    };
                    const userDocRef = doc(firestore, 'userProfiles', user.uid);
                    await setDoc(userDocRef, userProfile);
                    console.log("User profile created successfully");
                    router.push('/profile');
                }).catch((error) => {
                    console.log(error);
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <ChakraProvider>
            <Box width="100vw" height="100vh" display="flex" justifyContent="center" alignItems="center" bg="gray.100">
                <Box bg="white"
                    p={8}
                    borderRadius="md"
                    boxShadow="lg">
                    <form onSubmit={
                        handleSubmit(onSubmit)
                    }>
                        <Stack spacing={4}>
                            <FormControl isInvalid={
                                    !!errors.email
                                }
                                isRequired>
                                <FormLabel>Email</FormLabel>
                                <Input type="email" placeholder="Enter your email" autoComplete="off" {...register('email', { required: 'Email is required' })}
                                    onFocus={
                                        () => clearErrors('email')
                                    }/>
                                <FormErrorMessage>{
                                    errors.email && errors.email.message ?. toString()
                                }</FormErrorMessage>
                            </FormControl>

                            <FormControl isInvalid={
                                    !!errors.password
                                }
                                isRequired>
                                <FormLabel>Password</FormLabel>
                                <Input type="password" placeholder="Password" autoComplete="off" {...register('password', { required: 'Password is required' })}/>
                                <FormErrorMessage>{
                                    errors.password && errors.password.message ?. toString()
                                }</FormErrorMessage>
                            </FormControl>

                            <FormControl isInvalid={
                                    !!errors.password
                                }
                                isRequired>
                                <FormLabel>Profile name</FormLabel>
                                <Input type="text" placeholder="" autoComplete="off" {...register('profileName', { required: 'Profile name is required' })}/>
                                <FormErrorMessage>{
                                    errors.password && errors.password.message ?. toString()
                                }</FormErrorMessage>
                            </FormControl>

                            <FormControl isInvalid={
                                    !!errors.password
                                }
                                isRequired>
                                <FormLabel>Profile description</FormLabel>
                                <Textarea placeholder="" autoComplete="off" {...register('profileDescription', { required: 'Profile description is required' })}/>
                                <FormErrorMessage>{
                                    errors.password && errors.password.message ?. toString()
                                }</FormErrorMessage>
                            </FormControl>
                            <Menu closeOnSelect={false}>
                                <MenuButton as={Button}
                                    colorScheme='blue'>
                                    Select Genres
                                </MenuButton>
                                <MenuList minWidth='240px'>
                                    <MenuOptionGroup title='Select Genres' type='checkbox'>
                                        <MenuItemOption value='politics'
                                            onClick={
                                                () => setSelectedGenres(prevGenres => [
                                                    ...prevGenres,
                                                    'politics'
                                                ])
                                        }>
                                            Politics
                                        </MenuItemOption>
                                        <MenuItemOption value='poetry'
                                            onClick={
                                                () => setSelectedGenres((prevGenres: any) => [
                                                    ...prevGenres,
                                                    'poetry'
                                                ])
                                        }>
                                            Poetry
                                        </MenuItemOption>
                                        <MenuItemOption value='romance'
                                            onClick={
                                                () => setSelectedGenres((prevGenres: any) => [
                                                    ...prevGenres,
                                                    'romance'
                                                ])
                                        }>
                                            Romance
                                        </MenuItemOption>
                                        <MenuItemOption value='historical'
                                            onClick={
                                                () => setSelectedGenres((prevGenres: any) => [
                                                    ...prevGenres,
                                                    'historical'
                                                ])
                                        }>
                                            Historical
                                        </MenuItemOption>

                                    </MenuOptionGroup>
                                </MenuList>
                            </Menu>

                            {
                            errors.email && (
                                <Text color="red" fontSize="sm">
                                    {
                                    errors.email.message ?. toString()
                                } </Text>
                            )
                        }

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
