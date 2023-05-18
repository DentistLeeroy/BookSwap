import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Box, ChakraProvider, Flex, Link, VStack } from '@chakra-ui/react';

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

const ProfilePage: React.FC = () => {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const { pathname } = router;

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Fetch user profile data here
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    // Retrieve user profile data from local storage or fetch it
    const storedUserProfile = localStorage.getItem('userProfile');
    if (storedUserProfile) {
      setUserProfile(JSON.parse(storedUserProfile));
    } else {
      fetchUserProfile();
    }
  }, []);

  const handleNavItemClicked = (path: string) => {
    router.push(path);
  };

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

        {/* Render your profile page content here */}
        <Flex flex={1} justifyContent="center" alignItems="center" bg="gray.100">
          <Box bg="white" p={8} borderRadius="md" boxShadow="lg">
            <Box mb={4}>
              <h1>Your Profile</h1>
              <img src="/images/tyler.png" alt="avatar" />
            </Box>
            <Box mb={4}>
              <h2>{userProfile?.name}</h2>
              <h3>{userProfile?.description}</h3>
            </Box>
            <Box>
              <VStack spacing={2}>
                {userProfile?.interests.map((interest) => (
                  <Box key={interest} bg="blue.500" color="white" py={1} px={2} borderRadius="md" mb={2}>
                    {interest}
                  </Box>
                ))}
              </VStack>
            </Box>
          </Box>
        </Flex>
      </Flex>
    </ChakraProvider>
  );
};

export default ProfilePage;
