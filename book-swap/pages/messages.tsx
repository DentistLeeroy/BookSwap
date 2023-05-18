import React from 'react';
import { useRouter } from 'next/router';
import { Avatar, Box, ChakraProvider, extendTheme, Flex, Link, Text, VStack } from '@chakra-ui/react';

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

const ProfilePage: React.FC = () => {
  const router = useRouter();
  const { pathname } = router;

  const handleNavItemClicked = (path: string) => {
    router.push(path);
  };

  return (
    <ChakraProvider>
      <Box p={4}>
        <Flex direction="row">
          <VStack align="flex-start" spacing={4} pr={4} borderRight="1px solid" borderColor="gray.200">
            {/* Render bottom navigation */}
            {bottomNavItems.map((item) => (
              <Link
                key={item.path}
                onClick={() => handleNavItemClicked(item.path)}
                color={pathname === item.path ? 'blue.500' : 'gray.500'}
                fontWeight={pathname === item.path ? 'bold' : 'normal'}
              >
                {item.label}
              </Link>
            ))}
          </VStack>

          {/* Render your profile page content here */}
          <Flex direction="column" align="center" justify="center" flex={1}>
            {/* Chat-like messages */}
            <VStack spacing={4} mt={4} maxWidth={400}>
              <Flex alignItems="center">
                <Avatar name="John Doe" size="sm" />
                <Text ml={2}>Hey there! Did you know...</Text>
              </Flex>
              <Flex alignItems="center">
                <Avatar name="Jane Smith" size="sm" />
                <Text ml={2}>...that Rick Astley...</Text>
              </Flex>
              <Flex alignItems="center">
                <Avatar name="John Doe" size="sm" />
                <Text ml={2}>...gave us the amazing song...</Text>
              </Flex>
              <Flex alignItems="center">
                <Avatar name="Jane Smith" size="sm" />
                <Text ml={2}>...called Never Gonna Give You Up?</Text>
              </Flex>
              <Flex alignItems="center">
                <Avatar name="John Doe" size="sm" />
                <Text ml={2}>...It's a classic!</Text>
              </Flex>
              <Flex alignItems="center">
                <Avatar name="Jane Smith" size="sm" />
                <Text ml={2}>
                  ...Here's a little surprise for you:{' '}
                  <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" target="_blank" rel="noopener noreferrer">
                    Click here!
                  </a>
                </Text>
              </Flex>
            </VStack>

          </Flex>
        </Flex>
      </Box>
    </ChakraProvider>
  );
};

export default ProfilePage;
