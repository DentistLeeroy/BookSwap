import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { firestore, doc, getDocs } from '../app/firebase/server/firebase';
import { getAuth } from 'firebase/auth';
import { getDoc, getFirestore } from 'firebase/firestore/lite';
import { Box, ChakraProvider, Stack } from '@chakra-ui/react';

type UserProfile = {
  name: string;
  description: string;
  interests: string[];
};

const ProfilePage: React.FC = () => {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const auth = getAuth();
  const userId = auth.currentUser?.uid;

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (userId) {
          const userDocRef = doc(getFirestore(), 'userProfiles', userId); // Reference to the user's profile document
          const userDocSnap = await getDoc(userDocRef); // Fetch the user's profile document

          if (userDocSnap.exists()) {
            const userProfileData = userDocSnap.data() as UserProfile; // Get the user profile data
            setUserProfile(userProfileData); // Update the state with the fetched user profile
            localStorage.setItem('userProfile', JSON.stringify(userProfileData)); // Store the user profile data in local storage
          }
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    // Check if user profile data exists in local storage and retrieve it
    const storedUserProfile = localStorage.getItem('userProfile');
    if (storedUserProfile) {
      setUserProfile(JSON.parse(storedUserProfile));
    } else {
      fetchUserProfile();
    }
  }, [userId]);
  return (
    <ChakraProvider>
      <Box width="100vw" height="100vh" display="flex" justifyContent="center" alignItems="center" bg="gray.100">
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
            <Stack spacing={2}>
              {userProfile?.interests.map((interest) => (
                <Box key={interest} bg="blue.500" color="white" py={1} px={2} borderRadius="md" mb={2}>
                  {interest}
                </Box>
              ))}
            </Stack>
          </Box>
        </Box>
      </Box>
    </ChakraProvider>
  );
};  

export default ProfilePage;
