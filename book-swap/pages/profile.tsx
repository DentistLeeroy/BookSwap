// pages/profile.tsx

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


      <div className='flex-container'>
        <h1>Your Profile</h1>
        <img src="/images/tyler.png" alt="avatar" />
        <h2>Tyler</h2>
        <h3>Average Marxism Enjoyer</h3>
        <span className='horizontal-container'>
          <h4>Fiction</h4>
          <h4>Politics</h4>
          <h4>Poetry</h4>
        </span>
        <span className='horizontal-container'>
          <img src="/images/book.png" alt="book" />
          <h3><u>Add new</u></h3>
        </span>
      </div>
      {/* Add styles for the active bottom navigation item */}
      <style jsx>{`
        .active {
          font-weight: bold;
        }

        .flex-container{
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .horizontal-container{
          display: flex;
          flex-direction: row;
          gap: 20px;
          align-items: center;
        }
      `}</style>
    </div>
  );
};

export default ProfilePage;
