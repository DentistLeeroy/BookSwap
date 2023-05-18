import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Avatar, Box, Button, ChakraProvider, Flex, Icon, Image, Text, VStack, Link } from '@chakra-ui/react';
import { ChevronRightIcon, CloseIcon, StarIcon } from '@chakra-ui/icons';

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

type Book = {
  id: number;
  title: string;
  image: string;
};

const books: Book[] = [
  {
    id: 1,
    title: 'Fight Club',
    image: '/images/book.png',
  },
  {
    id: 2,
    title: 'War and Peace',
    image: '/images/book-2.png',
  },
  {
    id: 3,
    title: 'My book cover',
    image: '/images/book-3.png',
  },
  // Add more books here
];

const HomePage: React.FC = () => {
  const [currentBookIndex, setCurrentBookIndex] = useState(0);
  const [noNewBooks, setNoNewBooks] = useState(false);
  const router = useRouter();
  const { pathname } = router;

  const handleNavItemClicked = (path: string) => {
    router.push(path);
  };

  const handleLike = () => {
    if (currentBookIndex < books.length - 1) {
      setCurrentBookIndex((prevIndex) => prevIndex + 1);
    } else {
      setNoNewBooks(true);
    }
  };

  const handleDislike = () => {
    if (currentBookIndex < books.length - 1) {
      setCurrentBookIndex((prevIndex) => prevIndex + 1);
    } else {
      setNoNewBooks(true);
    }
  };

  const currentBook = books[currentBookIndex];

  return (
    <ChakraProvider>
      <Flex height="100vh" width="100vw">
        <VStack align="flex-start" spacing={4} pr={8} borderRight="1px solid" borderColor="gray.200">
          {/* Render bottom navigation */}
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
        </VStack>

        {/* Render your home page content here */}
        <Box flex={1} p={4} bg="gray.100">
          {noNewBooks ? (
            <Box p={4}>
              <Flex justifyContent="center" alignItems="center" height="100%">
                <Image src="/images/old.jpg" alt="No new books" maxH={400} objectFit="cover" borderRadius="md" />
              </Flex>
              <Text fontSize="2xl" textAlign="center" mt={4}>
                No new books
              </Text>
            </Box>
          ) : (
            <Flex direction="column" alignItems="center">
              <Image src={currentBook.image} alt={currentBook.title} maxH={400} objectFit="cover" borderRadius="md" />
              <VStack spacing={4} mt={4}>
                <Text fontSize="2xl">{currentBook.title}</Text>
                <Flex>
                  <Button
                    onClick={handleLike}
                    leftIcon={<Icon as={StarIcon} boxSize={5} />}
                    colorScheme="green"
                    disabled={currentBookIndex === books.length - 1} // Disable the button when on the last book
                  >
                    Like
                  </Button>
                  <Button
                    onClick={handleDislike}
                    leftIcon={<Icon as={CloseIcon} boxSize={5} />}
                    colorScheme="red"
                    disabled={currentBookIndex === books.length - 1} // Disable the button when on the last book
                    ml={4}
                  >
                    Dislike
                  </Button>
                </Flex>
              </VStack>
              <Box mt={4} textAlign="center">
                {currentBookIndex === books.length - 1 ? ( // Check if on the last book
                  <Text>No new books</Text>
                ) : (
                  <Button onClick={handleLike} colorScheme="teal" leftIcon={<Icon as={ChevronRightIcon} />} size="lg">
                    Next Book
                  </Button>
                )}
              </Box>
            </Flex>
          )}
        </Box>
      </Flex>
    </ChakraProvider>
  );
};

export default HomePage;
