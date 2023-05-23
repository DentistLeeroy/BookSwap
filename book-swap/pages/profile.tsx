import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getAuth } from 'firebase/auth';
import { Alert, AlertIcon, Box, ChakraProvider, Stack, Button, Heading, Menu, MenuButton, MenuList, MenuItemOption, MenuOptionGroup, FormControl, FormLabel, Input, VStack, Link, Flex, Textarea } from '@chakra-ui/react';
import { getDoc, getFirestore, collection, doc, setDoc, getDocs } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import useRequireAuth from '../utils/useRequireAuth';
import AuthDetails from '@/app/firebase/server/AuthDetails';

type BottomNavItem = {
  label: string;
  path: string;
};

const bottomNavItems: BottomNavItem[] = [
  { label: 'Home', path: '/home' },
  { label: 'Messages', path: '/messages' },
  { label: 'History', path: '/history' },
  { label: 'Profile', path: '/profile' },
];

type UserProfile = {
  name: string;
  description: string;
  interests: string[];
};

type UserBook = {
  title: string;
  author: string;
  genres: string[];
  picture: string;
  token: string;
};

const ProfilePage: React.FC = () => {
  const router = useRouter();
  const { pathname } = router;
  const currentUser = useRequireAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookTitle, setBookTitle] = useState('');
  const [bookAuthor, setBookAuthor] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const auth = getAuth();
  const userId = auth.currentUser?.uid;
  const [userBooks, setUserBooks] = useState<UserBook[]>([]);
  const [selectedPicture, setSelectedPicture] = useState<File | null>(null);
  const [isProfileUpdated, setIsProfileUpdated] = useState(false);


  const handleNavItemClicked = (path: string) => {
    router.push(path);
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (userId) {
          const firestore = getFirestore();
          const userDocRef = doc(firestore, 'userProfiles', userId);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const userProfileData = userDocSnap.data() as UserProfile;
            setUserProfile(userProfileData);
            localStorage.setItem('userProfile', JSON.stringify(userProfileData));
          }
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };


    const fetchUserBooks = async () => {
      try {
        if (userId) {
          const firestore = getFirestore();
          const userBooksRef = doc(firestore, 'userBooks', userId);
          const userBooksSnapshot = await getDoc(userBooksRef);

          if (userBooksSnapshot.exists()) {
            const userBooksData = userBooksSnapshot.data();
            const books = userBooksData?.books || [];

            const updatedUserBooks = books.map((book: any) => {
              const pictureURL = book.picture;
              return { ...book, picture: pictureURL };
            });

            setUserBooks(updatedUserBooks);
          }
        }
      } catch (error) {
        console.error('Error fetching user books:', error);
      }
    };

    fetchUserBooks();
    fetchUserProfile();
  }, [userId]);

  useEffect(() => {
    const storedUserProfile = localStorage.getItem('userProfile');
    if (storedUserProfile) {
      setUserProfile(JSON.parse(storedUserProfile));
    }
  }, []);

  useEffect(() => {
    const fetchBookGenres = async () => {
      try {
        const firestore = getFirestore();
        const bookGenresRef = collection(firestore, 'bookGenres');
        const snapshot = await getDocs(bookGenresRef);
        const bookGenres = snapshot.docs.map((doc) => doc.data().book);
        setGenres(bookGenres);
      } catch (error) {
        console.error('Error fetching book genres:', error);
      }
    };

    fetchBookGenres();
  }, []);

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

 
  const handlePictureUpload = async () => {
    try {
      if (!selectedPicture) {
        return;
      }

      const file = selectedPicture;
      const storage = getStorage();
      const userId = auth.currentUser?.uid;
      const timestamp = Date.now();
      const picturePath = `bookPictures/${userId}/${bookTitle}_${timestamp}`;

      const pictureRef = ref(storage, picturePath);

      const uploadTask = uploadBytesResumable(pictureRef, file);

      uploadTask.on(
        'state_changed',
        (_snapshot) => {
          // handle upload progress or other events if needed
        },
        (error) => {
          // handle error
          console.error('Error uploading picture:', error);
        },
        async () => {
          // upload complete
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

          setBookTitle('');
          setBookAuthor('');
          setSelectedGenres([]);
          setSelectedPicture(null); // Reset the selected picture

          setIsModalOpen(false);

          const userBook: UserBook = {
            title: bookTitle,
            author: bookAuthor,
            genres: selectedGenres,
            picture: downloadURL,
            token: '',
          };

          setUserBooks((prevUserBooks) => [...prevUserBooks, userBook]);

          const firestore = getFirestore();
          const userBooksRef = collection(firestore, 'userBooks');
          const userBookDocRef = doc(userBooksRef, userId);
          await setDoc(userBookDocRef, { books: [...userBooks, userBook] }, { merge: true });
        }
      );
    } catch (error) {
      console.error('Error uploading picture:', error);
    }
  };
  
  

const handleUpload = async () => {
  try {
    const auth = getAuth();
    const userId = auth.currentUser?.uid;
    if (!userId) {
      throw new Error('User ID not found');
    }

    const firestore = getFirestore();
    const userBooksRef = collection(firestore, 'userBooks');
    const timestamp = Date.now();
    const picturePath = `bookPictures/${userId}/${bookTitle}_${timestamp}`;
    await setDoc(doc(userBooksRef, userId), {
      title: bookTitle,
      author: bookAuthor,
      genres: selectedGenres,
      picture: picturePath,
    });

    setIsModalOpen(false);
  } catch (error) {
    console.error('Error uploading book:', error);
  }
  handlePictureUpload();
};

const handleDeleteBook = async (book: UserBook) => {
  try {
    // Delete the book from the userBooks collection in Firestore
    const firestore = getFirestore();
    const userBooksRef = collection(firestore, 'userBooks');
    const userId = auth.currentUser?.uid;
    if (!userId) {
      throw new Error('User ID not found');
    }
    const userBookDocRef = doc(userBooksRef, userId);
    const userBookDocSnapshot = await getDoc(userBookDocRef);
    if (userBookDocSnapshot.exists()) {
      const userBooksData = userBookDocSnapshot.data();
      const books = userBooksData?.books || [];
      const updatedBooks = books.filter((b: UserBook) => b.token !== book.token);
      await setDoc(userBookDocRef, { books: updatedBooks }, { merge: true });
    }

    // Perform any additional cleanup or actions required

    // Update the state to reflect the deleted book
    setUserBooks((prevUserBooks) => prevUserBooks.filter((b: UserBook) => b.token !== book.token));
  } catch (error) {
    console.error('Error deleting book:', error);
  }
};



const handleSaveChanges = async () => {
  try {
    const firestore = getFirestore();
    const userDocRef = doc(firestore, 'userProfiles', userId);
    await setDoc(userDocRef, userProfile); // Assumes userProfile is updated with the edited name and description
    // Perform other necessary actions to save the changes

    setIsProfileUpdated(true); // Set the flag to display the success message
  } catch (error) {
    console.error('Error saving changes:', error);
  }
};

useEffect(() => {
  if (isProfileUpdated) {
    const timeout = setTimeout(() => {
      setIsProfileUpdated(false); // Reset the flag to hide the success message
    }, 3000); // Delay in milliseconds (3 seconds)

    return () => clearTimeout(timeout); // Cleanup function to clear the timeout when the component is unmounted or the flag changes
  }
}, [isProfileUpdated]);



  if (!currentUser) {
    return <div>Loading...</div>;
  }


  return (
    <ChakraProvider>
      <Flex>
      <VStack align="flex-start" spacing={4} pr={8} borderRight="1px solid" borderColor="gray.200">
        {/* Render navigation */}
        {bottomNavItems.map((item) => (
          <Link
            key={item.path}
            onClick={() => handleNavItemClicked(item.path)}
            color={pathname === item.path ? 'blue.500' : 'gray.500'}
            fontWeight={pathname === item.path ? 'bold' : 'normal'}
            p={2}
          >
            {item.label}
          </Link>
        ))}
        <AuthDetails />
      </VStack>
  
      <Box width="100vw" minHeight="100vh" display="flex" justifyContent="center" alignItems="center" bg="gray.100">
          <Box maxH="100%">
            <Heading as="h1" mb={4}>Your Profile</Heading>
  
            <Box textAlign="center" mb={4}>
              <img src="/images/tyler.png" alt="avatar" />
            </Box>
  
            <Box mb={4}>
              <Heading as="h2" size="md" mb={2}>Name</Heading>
              <Input variant="outline" value={userProfile?.name} onChange={(e) => setUserProfile({ ...userProfile, name: e.target.value })} />
            </Box>
            <Box mb={4}>
              <Heading as="h2" size="md" mb={2}>About me</Heading>
              <Textarea variant="outline" value={userProfile?.description} onChange={(e) => setUserProfile({ ...userProfile, description: e.target.value })} />
            </Box>
  
            <Box mb={4}>
              <Heading as="h2" size="md" mb={2}>Interests</Heading>
              <Box width="400px">
                <Stack spacing={2}>
                  {userProfile?.interests.map((interest) => (
                    <Box key={interest} bg="blue.500" color="white" py={1} px={2} borderRadius="md" mb={2}>
                      {interest}
                    </Box>
                  ))}
                </Stack>
              </Box>
            </Box>
  
            <Box mb={4}>
            <Heading as="h2" size="md" mb={2}>
              Books on the shelf
            </Heading>
            <Box overflowX="auto" whiteSpace="nowrap">
              {userBooks.length > 0 ? (
                userBooks.map((book) => (
<Box key={book.title} display="inline-block" width="200px" mr={4}>
  <Button variant="link" onClick={() => handleDeleteBook(book)}>X</Button>
  <img src={book.picture} alt={book.title} style={{ maxWidth: '100px' }} />
  <Heading as="h3" size="sm" mt={2}>
    {book.title}
  </Heading>
  <Heading as="h4" size="xs" mt={1}>
    {book.author}
  </Heading>
</Box>

                ))
              ) : (
                <p>No books found.</p>
              )}
            </Box>
          </Box>
  
            <Box mb={4}>
              <Heading as="h2" size="md" mb={2}>Upload Book</Heading>
              <Button colorScheme="blue" onClick={handleModalOpen}>Upload</Button>
            </Box>
            {isProfileUpdated && (
        <Alert status='success'>
          <AlertIcon />
          Profile updated!
        </Alert>
      )}
      <Button colorScheme="blue" onClick={handleSaveChanges}>Save Changes</Button>
          </Box>
        </Box>
  
      {isModalOpen && (
        <Box
          position="fixed"
          top={0}
          left={0}
          width="100vw"
          height="100vh"
          display="flex"
          justifyContent="center"
          alignItems="center"
          bg="rgba(0, 0, 0, 0.5)"
        >
          <Box bg="white" p={4} borderRadius="md">
            <Heading as="h2" size="md" mb={4}>Upload Book</Heading>
            <FormControl>
              <FormLabel>Title</FormLabel>
              <Input
                placeholder="Enter book title"
                value={bookTitle}
                onChange={(e) => setBookTitle(e.target.value)}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Author</FormLabel>
              <Input
                placeholder="Enter book author"
                value={bookAuthor}
                onChange={(e) => setBookAuthor(e.target.value)}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Select Genres</FormLabel>
              <Menu closeOnSelect={false}>
                <MenuButton as={Button} variant="outline">
                  Select Genres
                </MenuButton>
                <MenuList minWidth='240px' style={{ maxHeight: '200px', overflowY: 'auto' }}>
                  <MenuOptionGroup title="Select Genres" type="checkbox">
                    {genres.map((genre) => (
                      <MenuItemOption
                        key={genre}
                        value={genre}
                        onClick={() => setSelectedGenres((prevGenres) => [...prevGenres, genre])}
                      >
                        {genre}
                      </MenuItemOption>
                    ))}
                  </MenuOptionGroup>
                </MenuList>
              </Menu>
            </FormControl>
            <Box mb={4}>
              <FormControl mt={4}>
                <FormLabel>Picture</FormLabel>
                <Input type="file" onChange={(e) => setSelectedPicture(e.target.files?.[0] || null)} />
              </FormControl>
            </Box>
            <Button colorScheme="blue" mt={4} onClick={handleUpload}>
              Upload
            </Button>
            <Button colorScheme="gray" mt={4} ml={2} onClick={handleModalClose}>
              Cancel
            </Button>
          </Box>
        </Box>
      )}
      </Flex>
    </ChakraProvider>
  );
  
};
export default ProfilePage;