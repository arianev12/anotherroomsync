import { createContext, useContext, useState, ReactNode } from 'react';

interface StudentContextType {
  savedFavorites: number[];
  toggleFavorite: (dormId: number) => void;
  isFavorite: (dormId: number) => boolean;
  hasDorm: boolean;
  currentDorm: {
    id: number;
    name: string;
    roomNumber: string;
    roomCapacity: number;
    roomAvailable: number;
  } | null;
  setCurrentDorm: (dorm: { id: number; name: string; roomNumber: string; roomCapacity: number; roomAvailable: number } | null) => void;
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export function StudentProvider({ children }: { children: ReactNode }) {
  const [savedFavorites, setSavedFavorites] = useState<number[]>([]);
  const [currentDorm, setCurrentDorm] = useState<{ id: number; name: string; roomNumber: string; roomCapacity: number; roomAvailable: number } | null>(null);

  const toggleFavorite = (dormId: number) => {
    setSavedFavorites(prev =>
      prev.includes(dormId)
        ? prev.filter(id => id !== dormId)
        : [...prev, dormId]
    );
  };

  const isFavorite = (dormId: number) => savedFavorites.includes(dormId);

  const hasDorm = currentDorm !== null;

  return (
    <StudentContext.Provider value={{
      savedFavorites,
      toggleFavorite,
      isFavorite,
      hasDorm,
      currentDorm,
      setCurrentDorm
    }}>
      {children}
    </StudentContext.Provider>
  );
}

export function useStudent() {
  const context = useContext(StudentContext);
  if (context === undefined) {
    throw new Error('useStudent must be used within a StudentProvider');
  }
  return context;
}