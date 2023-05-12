import React from 'react';
import { useRouter } from 'next/router';

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
    <div>
      {/* Render your profile page content here */}
      <h1>Profile Page</h1>

      {/* Render bottom navigation */}
      <nav>
        <ul>
          {bottomNavItems.map((item) => (
            <li
              key={item.path}
              className={pathname === item.path ? 'active' : ''}
              onClick={() => handleNavItemClicked(item.path)}
            >
              {item.label}
            </li>
          ))}
        </ul>
      </nav>

      {/* Add styles for the active bottom navigation item */}
      <style jsx>{`
        .active {
          font-weight: bold;
        }
      `}</style>
    </div>
  );
};

export default ProfilePage;
