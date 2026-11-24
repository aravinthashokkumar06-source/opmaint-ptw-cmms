'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface UserPersona {
  id: string;
  name: string;
  email: string;
  role: 'REQUESTER' | 'AREA_OWNER' | 'SAFETY_OFFICER' | 'ADMIN';
  department: string | null;
  assignedAreas?: { id: string; name: string }[];
}

interface AuthContextType {
  currentUser: UserPersona | null;
  allUsers: UserPersona[];
  loading: boolean;
  switchUser: (userId: string) => void;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  allUsers: [],
  loading: true,
  switchUser: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserPersona | null>(null);
  const [allUsers, setAllUsers] = useState<UserPersona[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUsers() {
      try {
        const res = await fetch('/api/auth/users');
        const data = await res.json();
        if (data.users && data.users.length > 0) {
          setAllUsers(data.users);
          const savedUserId = typeof window !== 'undefined' ? localStorage.getItem('opmaint_active_user_id') : null;
          const matched = data.users.find((u: UserPersona) => u.id === savedUserId);
          setCurrentUser(matched || data.users[0]);
        }
      } catch (err) {
        console.error('Failed to load demo users', err);
      } finally {
        setLoading(false);
      }
    }
    loadUsers();
  }, []);

  const switchUser = (userId: string) => {
    const user = allUsers.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user);
      if (typeof window !== 'undefined') {
        localStorage.setItem('opmaint_active_user_id', user.id);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, allUsers, loading, switchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
