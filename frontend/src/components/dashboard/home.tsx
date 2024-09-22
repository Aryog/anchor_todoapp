"use client"
import { useState, useEffect } from 'react';
import { useTodoProgram } from '../../hooks/useTodoProgram';
import { Card } from '@/components/ui/card';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Moon, Sun } from "lucide-react";
import dynamic from 'next/dynamic';
import TodoList from './todolist';
import { TodoItem } from './todolist';

export default function Home() {
	const WalletMultiButton = dynamic(() => import('@solana/wallet-adapter-react-ui').then(mod => mod.WalletMultiButton), { ssr: false });
	const [todo, setTodo] = useState('');
	const [todos, setTodos] = useState<TodoItem[]>();
	const [isDarkMode, setIsDarkMode] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const { addTodo, markTodo, getAllTodos, connected, publicKey, wallet, provider, program, initializeTodo } = useTodoProgram();

	useEffect(() => {
		const savedDarkMode = localStorage.getItem('darkMode') === 'true';
		setIsDarkMode(savedDarkMode);
		if (savedDarkMode) {
			document.documentElement.classList.add('dark');
		}

		// Add a delay before setting isLoading to false
		const timer = setTimeout(() => {
			setIsLoading(false);
		}, 2000); // 2 second delay

		return () => clearTimeout(timer);
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

	useEffect(() => {
		const fetchTodos = async () => {
			try {
				const fetchedTodos = await getAllTodos();
				if (fetchedTodos) {
					console.log(fetchedTodos);
					setTodos(fetchedTodos);
				}
			} catch (error) {
				console.error('Error fetching todos:', error);
			}
		};
		console.log('TodoApp render:', {
			connected,
			publicKey: publicKey?.toBase58(),
			wallet: wallet ? 'Available' : 'Not available',
			provider: provider ? 'Available' : 'Not available',
			program: program ? 'Available' : 'Not available'
		});

		if (connected) { initializeTodo(); fetchTodos(); }
	}, [connected, initializeTodo]);

	const handleaddTodo = async () => {
		try {
			await addTodo(todo);
			setTodo('');
		} catch (err) {
			console.error(err);
		}
	};

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
				<div className="text-2xl font-bold text-gray-800 dark:text-white">Loading...</div>
			</div>
		);
	}

	return (
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
							<Button onClick={handleaddTodo} className="bg-blue-500 hover:bg-blue-600 text-white">
								Add Todo
							</Button>
						</div>
						<WalletMultiButton className="!bg-purple-500 hover:!bg-purple-600 text-white rounded-lg px-4 py-2" />
					</div>
					<div className="w-full h-full bg-gray-100 py-6 flex flex-col sm:py-12">
						{todos && <TodoList initialTodos={todos} markTodo={markTodo} />}
					</div>
				</Card>
			</div>
		</div>
	);
}
