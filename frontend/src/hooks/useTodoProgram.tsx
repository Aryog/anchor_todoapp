
import { useEffect, useState, useMemo, useCallback } from 'react';
import * as anchor from '@coral-xyz/anchor';
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { Program, AnchorProvider, web3, setProvider, Idl } from '@coral-xyz/anchor';
import idl from '../idl/anchor_todo.json';

export const useTodoProgram = () => {
	const { connection } = useConnection();
	console.log('Connected to network:', connection.rpcEndpoint);
	const wallet = useAnchorWallet();
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		console.log('Wallet state changed:', {
			publicKey: wallet?.publicKey.toBase58(),
			wallet: wallet ? 'Available' : 'Not available',
			connection: connection ? 'Available' : 'Not available'
		});

		const timer = setTimeout(() => {
			setIsLoading(false);
			console.log('Loading finished');
		}, 2000);

		return () => clearTimeout(timer);
	}, [wallet, connection]);

	const provider = useMemo(() => {
		if (isLoading) {
			console.log('Still loading, not creating provider yet');
			return null;
		}

		if (!wallet) {
			console.log('Provider not created: wallet is null');
			return null;
		}
		return new AnchorProvider(connection, wallet, {});

	}, [wallet, connection, isLoading]);

	const program = useMemo(() => {
		if (!provider) {
			console.log('Program not created: provider is null');
			return null;
		}
		setProvider(provider);
		console.log('Creating program');
		return new Program(idl as Idl) as Program;
	}, [provider, wallet]);

	const initializeTodo = useCallback(async () => {
		console.log('initializeTodo called');
		if (!program || !wallet?.publicKey) {
			console.error('Wallet not connected or program not initialized');
			return;
		}
		try {
			const [todoAccount] = await web3.PublicKey.findProgramAddress(
				[Buffer.from('todo')],
				program.programId
			);
			const accountInfo = await program.provider.connection.getAccountInfo(todoAccount);
			if (accountInfo) {
				console.log('Todo account already initialized:', todoAccount.toString());
				return; // Account already exists, skip initialization
			}
			await program.methods
				.initialize()
				.accounts({
					todoAccount: todoAccount,
					user: wallet.publicKey,
					systemProgram: web3.SystemProgram.programId,
				})
				.rpc();
			console.log('Todo account initialized');
		} catch (error) {
			console.error('Error initializing todo account:', error);
		}
	}, [program, wallet]);

	const addTodo = useCallback(async (content: string) => {
		console.log('addTodo called with:', content);
		console.log('Program:', program);
		console.log('PublicKey:', wallet?.publicKey);
		if (!program || !wallet?.publicKey) {
			console.error('Wallet not connected or program not initialized');
			return;
		}
		try {
			const [todoAccount] = await web3.PublicKey.findProgramAddress(
				[Buffer.from('todo')],
				program.programId
			);

			// Check if the account is initialized
			const accountInfo = await program.provider.connection.getAccountInfo(todoAccount);
			if (!accountInfo) {
				console.error('Todo account not found. Please initialize it first.');
				return;
			}
			await program.methods
				.addTodo(content)
				.accounts({
					todoAccount: todoAccount,
					user: wallet.publicKey,
					systemProgram: web3.SystemProgram.programId,
				})
				.rpc();
			console.log('Todo added:', content);
		} catch (error) {
			console.error('Error adding todo:', error);
		}
	}, [program, wallet]);

	const markTodo = useCallback(async (index: number) => {
		if (!program || !wallet?.publicKey) {
			console.error('Wallet not connected or program not initialized');
			return;
		}
		try {
			const [todoAccount] = await web3.PublicKey.findProgramAddress(
				[Buffer.from('todo')],
				program.programId
			);
			await program.methods
				.markTodo(new anchor.BN(index))
				.accounts({
					todoAccount: todoAccount,
					user: wallet.publicKey,
				})
				.rpc();
			console.log('Todo marked at index:', index);
		} catch (error) {
			console.error('Error marking todo:', error);
		}
	}, [program, wallet]);

	const getAllTodos = useCallback(async () => {
		if (!program || !wallet?.publicKey) {
			console.error('Wallet not connected or program not initialized');
			return;
		}
		try {
			const [todoAccount] = await web3.PublicKey.findProgramAddress(
				[Buffer.from('todo')],
				program.programId
			);
			const accountInfo = await program.provider.connection.getAccountInfo(todoAccount);
			if (accountInfo) {
				// Use program.coder.accounts.decode instead of program.account.todoAccount.decode
				const todoAccountData = program.coder.accounts.decode('todoAccount', accountInfo.data);
				console.log('Fetched todos:', todoAccountData.todos);
				return todoAccountData.todos; // Return the todos
			} else {
				console.log('Todo account not found');
			}
		} catch (error) {
			console.error('Error fetching todos:', error);
		}
	}, [program, wallet]);// addTodo, markTodo, getAllTodos, connected, publicKey, wallet, provider, program
	return {
		addTodo,
		markTodo,
		getAllTodos,
		connected: !!wallet,
		publicKey: wallet?.publicKey,
		wallet,
		provider,
		program,
		initializeTodo
	};
}

