import React from 'react';
import { useRouter } from 'next/router';
import { Avatar, Box, ChakraProvider, Flex, Link, VStack, Text } from '@chakra-ui/react';
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

const MessagesPage: React.FC = () => {
  const router = useRouter();
  const { pathname } = router;

  const currentUser = useRequireAuth();

  const handleNavItemClicked = (path: string) => {
    router.push(path);
  };

  if (!currentUser) {
    // Redirect to login page or render a loading state if authentication is in progress
    return <div>Loading...</div>;
  }

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
          <AuthDetails />
        </VStack>

        {/* Render your messages page content here */}
        <Flex flex={1} justifyContent="center" alignItems="center" bg="gray.100">
          <Box bg="gray.100" p={6} borderRadius="md">
            <VStack spacing={6} align="stretch">
              <Flex alignItems="center">
                {/* Avatar for the first speaker */}
                <Avatar
                  name="John Doe"
                  size="md"
                  src="/images/avatar-7.png"
                />
                <Box
                  ml={3}
                  p={3}
                  bg="white"
                  borderRadius="md"
                  boxShadow="md"
                >
                  <Text fontSize="lg" color="gray.800">
                    <a
                      href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                      target="_blank"
                      rel="noopener noreferrer"
                      color="blue.500"
                    >
                      See you there!
                    </a>
                  </Text>
                </Box>
              </Flex>
              <Flex alignItems="center">
                {/* Avatar for the second speaker */}
                <Avatar
                  name="Jane Smith"
                  size="md"
                  src="/images/avatar-6.png"
                />
                <Box
                  ml={3}
                  p={3}
                  bg="white"
                  borderRadius="md"
                  boxShadow="md"
                >
                  <Text fontSize="lg" color="gray.800">
                    <a
                      href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                      target="_blank"
                      rel="noopener noreferrer"
                      color="blue.500"
                    >
                      I don’t think I will.
                    </a>
                  </Text>
                </Box>
              </Flex>
              <Flex alignItems="center">
                {/* Avatar for the first speaker */}
                <Avatar
                  name="John Doe"
                  size="md"
                  src="/images/avatar-5.png"
                />
                <Box
                  ml={3}
                  p={3}
                  bg="white"
                  borderRadius="md"
                  boxShadow="md"
                >
                  <Text fontSize="lg" color="gray.800">
                    <a
                      href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                      target="_blank"
                      rel="noopener noreferrer"
                      color="blue.500"
                    >
                      Come on, it’s a good deal...
                    </a>
                  </Text>
                </Box>
              </Flex>
              <Flex alignItems="center">
                {/* Avatar for the second speaker */}
                <Avatar
                  name="Jane Smith"
                  size="md"
                  src="/images/avatar-4.png"
                />
                <Box
                  ml={3}
                  p={3}
                  bg="white"
                  borderRadius="md"
                  boxShadow="md"
                >
                  <Text fontSize="lg" color="gray.800">
                    <a
                      href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                      target="_blank"
                      rel="noopener noreferrer"
                      color="blue.500"
                    >
                      So what’s your opinion on that?
                    </a>
                  </Text>
                </Box>
              </Flex>
              <Flex alignItems="center">
                {/* Avatar for the first speaker */}
                <Avatar
                  name="John Doe"
                  size="md"
                  src="/images/avatar-3.png"
                />
                <Box
                  ml={3}
                  p={3}
                  bg="white"
                  borderRadius="md"
                  boxShadow="md"
                >
                  <Text fontSize="lg" color="gray.800">
                    <a
                      href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                      target="_blank"
                      rel="noopener noreferrer"
                      color="blue.500"
                    >
                      The book seems too worn out.
                    </a>
                  </Text>
                </Box>
              </Flex>
              <Flex alignItems="center">
                {/* Avatar for the second speaker */}
                <Avatar
                  name="Jane Smith"
                  size="md"
                  src="/images/avatar.png"
                />
                <Box
                  ml={3}
                  p={3}
                  bg="white"
                  borderRadius="md"
                  boxShadow="md"
                >
                  <Text fontSize="lg" color="gray.800">
                    ...Here's a little surprise for you:{' '}
                    <a
                      href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                      target="_blank"
                      rel="noopener noreferrer"
                      color="blue.500"
                    >
                      Click here!
                    </a>
                  </Text>
                </Box>
              </Flex>
            </VStack>
          </Box>

        </Flex>
      </Flex>
    </ChakraProvider>
  );
};

export default MessagesPage;
