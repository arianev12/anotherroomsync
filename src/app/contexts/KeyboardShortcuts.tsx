import { useEffect } from 'react';
import { useNavigate } from 'react-router';

interface Shortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  description: string;
  action: () => void;
}

export function useKeyboardShortcuts(shortcuts: Shortcut[]) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        const ctrlMatch = shortcut.ctrl ? e.ctrlKey || e.metaKey : !e.ctrlKey && !e.metaKey;
        const shiftMatch = shortcut.shift ? e.shiftKey : !e.shiftKey;
        const altMatch = shortcut.alt ? e.altKey : !e.altKey;

        if (e.key.toLowerCase() === shortcut.key.toLowerCase() && ctrlMatch && shiftMatch && altMatch) {
          e.preventDefault();
          shortcut.action();
          break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
}

export function useGlobalShortcuts(role: 'admin' | 'owner' | 'student') {
  const navigate = useNavigate();

  const shortcuts: Shortcut[] = [
    {
      key: 'h',
      ctrl: true,
      description: 'Go to Dashboard',
      action: () => navigate(`/${role}`)
    },
    {
      key: 's',
      ctrl: true,
      description: 'Open Settings',
      action: () => navigate(`/${role}/settings`)
    },
    {
      key: '/',
      ctrl: true,
      description: 'Focus Search',
      action: () => {
        const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
        searchInput?.focus();
      }
    }
  ];

  // Add role-specific shortcuts
  if (role === 'student') {
    shortcuts.push(
      {
        key: 'd',
        ctrl: true,
        description: 'Find Dormitory',
        action: () => navigate('/student/find-dormitory')
      },
      {
        key: 'r',
        ctrl: true,
        description: 'Find Roommate',
        action: () => navigate('/student/roommate-matching')
      }
    );
  }

  useKeyboardShortcuts(shortcuts);
  
  return shortcuts;
}
