import React, { useState, useEffect } from 'react';
import ProfileMenu from '../components/ProfileMenu';
import EditProfileForm from '../components/EditProfileForm';
import { useTheme } from '../theme/ThemeContext';
import { motion } from 'framer-motion';

interface ProfileProps {
  onNavigate: (page: string) => void;
}

const Profile: React.FC<ProfileProps> = ({ onNavigate }) => {
  const { styles } = useTheme();
  const [user, setUser] = useState<any>({});

  const loadUser = () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user from localStorage", e);
        setUser({});
      }
    }
  };

  useEffect(() => {
    loadUser();

    // Listen for custom userUpdated event (same-tab login)
    const handleUserUpdate = (e: CustomEvent) => {
      setUser(e.detail);
    };

    window.addEventListener('userUpdated', handleUserUpdate as EventListener);
    return () => window.removeEventListener('userUpdated', handleUserUpdate as EventListener);
  }, []);

  return (
    <div className={`min-h-screen pt-12 pb-32 transition-colors duration-700 ${styles.colors.bg}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          {/* PROFILE MENU - Interests hidden for Edit Profile view */}
          {user && (
            <ProfileMenu
              user={user}
              activeTab="edit"
              onTabChange={(tab) => {
                if (tab === 'feed') onNavigate('projects');
                else if (tab === 'edit') onNavigate('profile');
                // Handle other tabs if needed
              }}
              showInterests={false}
            />
          )}
          
          <div className="flex-grow">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <EditProfileForm />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;