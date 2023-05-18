import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getAuth } from 'firebase/auth';
import { Box, ChakraProvider, Stack, Button, Heading, Menu, MenuButton, MenuList, MenuItemOption, MenuOptionGroup, FormControl, FormLabel, Input } from '@chakra-ui/react';
import { getDoc, getFirestore } from 'firebase/firestore';
import { getStorage, ref, uploadBytes } from 'firebase/storage';
import { firestore, collection, getDocs, doc, setDoc } from "../app/firebase/server/firebase";

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
};

const ProfilePage: React.FC = () => {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookTitle, setBookTitle] = useState('');
  const [bookAuthor, setBookAuthor] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const auth = getAuth();
  const userId = auth.currentUser?.uid;
  const [userBooks, setUserBooks] = useState<UserBook[]>([]);
  



  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (userId) {
          const userDocRef = doc(getFirestore(), 'userProfiles', userId);
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

    const storedUserProfile = localStorage.getItem('userProfile');
    if (storedUserProfile) {
      setUserProfile(JSON.parse(storedUserProfile));
    } else {
      fetchUserProfile();
    }
    fetchUserBooks(); // Fetch user's uploaded books
  }, [userId]);

  useEffect(() => {
    fetchBookGenres();
  }, []);

  const fetchBookGenres = async () => {
    const bookGenresRef = collection(firestore, "bookGenres");
    const snapshot = await getDocs(bookGenresRef);
    const bookGenres = snapshot.docs.map((doc) => doc.data().book);
    setGenres(bookGenres);
  };

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

const handlePictureUpload = async (e) => {
  try {
    const file = e.target.files[0];
    const storage = getStorage();
    const userId = auth.currentUser?.uid;
    const picturePath = `bookPictures/${userId}/${bookTitle}_${Date.now()}`; // Generate a unique identifier for the new picture

    // Upload the new picture with the unique identifier
    const pictureRef = ref(storage, picturePath);
    await uploadBytes(pictureRef, file);

    const userBook = {
      title: bookTitle,
      author: bookAuthor,
      genres: selectedGenres,
      picture: picturePath, // Update the picture path with the new unique identifier
    };
    setUserBooks((prevUserBooks) => [...prevUserBooks, userBook]);

    // Update the userBooks collection in Firestore
    const userBooksRef = collection(firestore, 'userBooks');
    const userBookDocRef = doc(userBooksRef, userId);
    await setDoc(userBookDocRef, { books: [...userBooks, userBook] }, { merge: true });
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
  
      const userBooksRef = collection(firestore, 'userBooks');
      const pictureRef = ref(getStorage(), `bookPictures/${userId}/${bookTitle}`);
      await setDoc(doc(userBooksRef, userId), {
        title: bookTitle,
        author: bookAuthor,
        genres: selectedGenres,
        picture: `bookPictures/${userId}/${bookTitle}` // Update the picture path to include the userID
      });
      setIsModalOpen(false); // Close the modal
    } catch (error) {
      console.error('Error uploading book:', error);
    }
  };
  
  
  
  const fetchUserBooks = async () => {
    try {
      const userBooksRef = collection(firestore, 'userBooks');
      const snapshot = await getDocs(userBooksRef);
      const userBooksData = snapshot.docs.map((doc) => {
        const bookData = doc.data() as UserBook;
        return { ...bookData, id: doc.id }; // Include the document ID
      });
      setUserBooks(userBooksData);
    } catch (error) {
      console.error('Error fetching user books:', error);
    }
  };

  return (
    <ChakraProvider>
      <Box width="100vw" minHeight="100vh" display="flex" justifyContent="center" alignItems="center" bg="gray.100">
        <Box bg="white" p={40} borderRadius="md" boxShadow="lg" overflowY="auto">
          <Box maxH="100%">
            <Heading as="h1" mb={4}>Your Profile</Heading>
  
            <Box textAlign="center" mb={4}>
              <img src="/images/tyler.png" alt="avatar" />
            </Box>
  
            <Box mb={4}>
              <Heading as="h2" size="md" mb={2}>Name</Heading>
              <Button variant="outline">{userProfile?.name}</Button>
            </Box>
            <Box mb={4}>
              <Heading as="h2" size="md" mb={2}>About me</Heading>
              <Button variant="outline">{userProfile?.description}</Button>
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
  <Heading as="h2" size="md" mb={2}>Books on the shelf</Heading>
 {userBooks.map((book) => (
  <Box key={book.title} mb={4}>
    <img src={`https://firebasestorage.googleapis.com/v0/b/exam-project-89444.appspot.com/o/${encodeURIComponent(book.picture)}?alt=media`} alt={book.title} style={{ maxWidth: '200px' }} />
    <Heading as="h3" size="sm" mt={2}>{book.title}</Heading>
    <Heading as="h4" size="xs" mt={1}>{book.author}</Heading>
  </Box>
))}

</Box>

            <Box mb={4}>
              <Heading as="h2" size="md" mb={2}>Upload Book</Heading>
              <Button colorScheme="blue" onClick={handleModalOpen}>Upload</Button>
            </Box>
          </Box>
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
              <Input type="file" onChange={handlePictureUpload} />
            </FormControl>
          </Box>
          <Button colorScheme="blue" mt={4} onClick={handleUpload}>Upload</Button>
          <Button colorScheme="gray" mt={4} ml={2} onClick={handleModalClose}>Cancel</Button>
        </Box>
      </Box>
    )}
  </ChakraProvider>
);
};
export default ProfilePage;