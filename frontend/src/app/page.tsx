
"use client"
import { useState, useEffect } from 'react';
import { useTodoProgram } from '../hooks/useTodoProgram';
import { Card } from '@/components/ui/card';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import WalletContextProvider from "@/context/WalletContext";
import { Moon, Sun } from "lucide-react";
import dynamic from 'next/dynamic';

export default function Home() {
  const WalletMultiButton = dynamic(() => import('@solana/wallet-adapter-react-ui').then(mod => mod.WalletMultiButton), { ssr: false });
  const { addTodo } = useTodoProgram();
  const [todo, setTodo] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(savedDarkMode);

    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [isDarkMode]);

  const handleAddTodo = async () => {
    try {
      await addTodo(todo);
      setTodo('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <WalletContextProvider>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
        <div className="container mx-auto px-4 py-8">
          <Card className="bg-white dark:bg-gray-800 shadow-lg rounded-lg">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Solana ToDo List</h1>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="rounded-full"
                >
                  {isDarkMode ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
                </Button>
              </div>
              <div className="flex space-x-4 mb-6">
                <Input
                  type="text"
                  placeholder="Enter a new todo"
                  value={todo}
                  onChange={(e) => setTodo(e.target.value)}
                  className="flex-grow dark:bg-gray-700 dark:text-white"
                />
                <Button onClick={handleAddTodo} className="bg-blue-500 hover:bg-blue-600 text-white">
                  Add Todo
                </Button>
              </div>
              <WalletMultiButton className="!bg-purple-500 hover:!bg-purple-600 text-white rounded-lg px-4 py-2" />
            </div>
          </Card>
        </div>
      </div>
    </WalletContextProvider>
  );
}

