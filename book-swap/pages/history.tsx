import React from 'react';
import { useRouter } from 'next/router';
import { Avatar, Box, ChakraProvider, Flex, Link, VStack, Text } from '@chakra-ui/react';
import useRequireAuth from '../utils/useRequireAuth';

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

const HistoryPage: React.FC = () => {
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
        </VStack>

        {/* Render your history page content here */}
        <Flex flex={1} justifyContent="center" alignItems="center" bg="gray.100">
          <Box p={4}>
            <VStack spacing={4} mt={4} maxWidth={400}>
              <Flex alignItems="center">
                <Avatar name="John Doe" size="sm" />
                <Text ml={2}>History item 1</Text>
              </Flex>
              <Flex alignItems="center">
                <Avatar name="Jane Smith" size="sm" />
                <Text ml={2}>History item 2</Text>
              </Flex>
              <Flex alignItems="center">
                <Avatar name="John Doe" size="sm" />
                <Text ml={2}>History item 3</Text>
              </Flex>
            </VStack>
          </Box>
        </Flex>
      </Flex>
    </ChakraProvider>
  );
};

export default HistoryPage;
