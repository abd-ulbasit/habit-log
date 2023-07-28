import React, { useState, useEffect, type FormEvent } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Trash } from 'lucide-react';
interface Todo {
    id: string;
    text: string;
    completed: boolean;
}

const TodoList: React.FC = () => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [newTodo, setNewTodo] = useState<string>('');

    useEffect(() => {
        const storedTodos = JSON.parse(localStorage.getItem('todos')!) as Todo[];
        if (storedTodos) {
            setTodos((prev) => {
                return [...prev, ...storedTodos]
            });
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('todos', JSON.stringify(todos));
    }, [todos]);

    const handleAddTodo = (e: FormEvent) => {
        e.preventDefault()
        if (newTodo.trim() !== '') {
            setTodos([...todos, { id: Math.random().toString(), text: newTodo, completed: false }]);
            setNewTodo('');
        }
    };

    const handleToggleTodo = (id: string) => {
        setTodos((prevTodos) =>
            prevTodos.map((todo) =>
                todo.id === id ? { ...todo, completed: !todo.completed } : todo
            )
        );
    };

    const handleRemoveTodo = (id: string) => {
        setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    };

    return (
        <div className="flex flex-col gap-4">
            <form className="flex flex-row gap-2 w-full sm:w-80 self-center" onSubmit={handleAddTodo}>
                <Input
                    className='flex-grow'
                    type="text"
                    placeholder="Enter your task..."
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                />
                <Button type='submit'>Add</Button>
            </form>
            <h1 className='font-bold text-2xl'>Todo List</h1>
            <div className=" flex gap-2 flex-col">
                {todos.map((todo) => (
                    <li
                        key={todo.id}
                        className={`flex gap-2 items-center ${todo.completed ? 'line-through' : ''}`}
                        onClick={() => handleToggleTodo(todo.id)}
                    >
                        <button onClick={() => handleRemoveTodo(todo.id)}><Trash></Trash></button>
                        <span>{todo.text}</span>
                    </li>
                ))}
            </div>
        </div>
    );
};

export default TodoList;
