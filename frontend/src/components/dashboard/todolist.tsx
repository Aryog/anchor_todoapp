import React, { useState } from 'react';
import { CheckCircle, Circle, Trash2 } from 'lucide-react';
export interface TodoItem {
	content: String;
	marked: boolean;
}
export interface todoListProps {
	initialTodos: TodoItem[];
}
const TodoList = ({ initialTodos }: todoListProps) => {
	const [todos, setTodos] = useState(initialTodos);

	const toggleTodo = (index: any) => {
		const newTodos = [...todos];
		newTodos[index].marked = !newTodos[index].marked;
		setTodos(newTodos);
	};

	const deleteTodo = (index: any) => {
		const newTodos = todos.filter((_, i) => i !== index);
		setTodos(newTodos);
	};

	return (
		<div className="max-w-md mx-auto mt-10 bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
			<div className="p-8">
				<div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold mb-4">My Todo List</div>
				<ul>
					{todos.map((todo, index) => (
						<li key={index} className="flex items-center justify-between py-5 px-5 border-b">
							<div className="flex items-center space-x-6 px-5">
								<button onClick={() => toggleTodo(index)} className="focus:outline-none">
									{todo.marked ? (
										<CheckCircle className="h-6 w-6 text-green-500" />
									) : (
										<Circle className="h-6 w-6 text-gray-400" />
									)}
								</button>
								<span className={`text-lg ${todo.marked ? 'line-through text-gray-500' : 'text-gray-800'}`}>
									{todo.content}
								</span>
							</div>
							<button onClick={() => deleteTodo(index)} className="text-red-500 hover:text-red-700 focus:outline-none">
								<Trash2 className="h-5 w-5" />
							</button>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
};

export default TodoList;
// Sample usage
