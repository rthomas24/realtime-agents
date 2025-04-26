import { useEffect, useRef, useState } from 'react';

interface ThemeSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const ThemeSettings = ({ isOpen, onClose }: ThemeSettingsProps) => {
  const [theme, setTheme] = useState('light');
  const menuRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close settings
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
      if (savedTheme !== 'system') {
        document.documentElement.setAttribute('data-theme', savedTheme);
      } else {
        applySystemTheme();
      }
    } else {
      // Default to system
      setTheme('system');
      applySystemTheme();
      localStorage.setItem('theme', 'system');
    }
  }, []);

  // Apply system theme based on media query
  const applySystemTheme = () => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const systemTheme = prefersDark ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', systemTheme);
  };

  // Add listener for system theme changes if using system preference
  useEffect(() => {
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applySystemTheme();
      
      // Initial check
      applySystemTheme();
      
      // Add listener
      mediaQuery.addEventListener('change', handleChange);
      
      // Cleanup
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  const toggleTheme = (newTheme: string) => {
    setTheme(newTheme);
    
    if (newTheme === 'system') {
      applySystemTheme();
    } else {
      document.documentElement.setAttribute('data-theme', newTheme);
    }
    
    localStorage.setItem('theme', newTheme);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="absolute bottom-16 right-4 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-50 border border-gray-200 dark:border-gray-700"
      ref={menuRef}
      style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
    >
      <div className="p-2 border-b border-gray-200 dark:border-gray-700" style={{ borderColor: 'var(--border)' }}>
        <h3 className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>Theme Settings</h3>
      </div>
      <div className="p-2">
        <div className="flex flex-col space-y-2 py-2">
          <button
            onClick={() => toggleTheme('light')}
            className={`px-3 py-1 text-xs rounded-md ${theme === 'light' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            style={{ 
              backgroundColor: theme === 'light' ? 'var(--accent)' : 'var(--button-bg)',
              color: theme === 'light' ? 'white' : 'var(--button-text)'
            }}
          >
            Light
          </button>
          <button
            onClick={() => toggleTheme('dark')}
            className={`px-3 py-1 text-xs rounded-md ${theme === 'dark' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            style={{ 
              backgroundColor: theme === 'dark' ? 'var(--accent)' : 'var(--button-bg)',
              color: theme === 'dark' ? 'white' : 'var(--button-text)'
            }}
          >
            Dark
          </button>
          <button
            onClick={() => toggleTheme('system')}
            className={`px-3 py-1 text-xs rounded-md ${theme === 'system' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            style={{ 
              backgroundColor: theme === 'system' ? 'var(--accent)' : 'var(--button-bg)',
              color: theme === 'system' ? 'white' : 'var(--button-text)'
            }}
          >
            System
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThemeSettings; 