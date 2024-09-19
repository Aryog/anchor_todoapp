
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Program, AnchorProvider, web3 } from '@project-serum/anchor';
import idl from '../idl/anchor_todo.json'; // The IDL for your Anchor program
import { PublicKey } from '@solana/web3.js';
import { useMemo } from 'react';

const PROGRAM_ID = new PublicKey("DMeNA3KKDFkK6wNLYVGts4zHmfLkY64c1wTfcqapubYB");

export const useTodoProgram = () => {
	const { connection } = useConnection();
	const { publicKey, wallet } = useWallet();

	const provider = useMemo(() => {
		if (!wallet || !publicKey) return null;
		return new AnchorProvider(connection, wallet, { preflightCommitment: 'processed' });
	}, [wallet, connection, publicKey]);

	const program = useMemo(() => {
		if (!provider) return null;
		return new Program(idl as any, PROGRAM_ID, provider);
	}, [provider]);

	const addTodo = async (content: string) => {
		if (!program || !publicKey) throw new Error('Wallet not connected');

		const [todoAccount] = await web3.PublicKey.findProgramAddress(
			[Buffer.from('todo'), publicKey.toBuffer()],
			program.programId
		);

		await program.methods
			.createTodo(content)
			.accounts({
				todo: todoAccount,
				user: publicKey,
				systemProgram: web3.SystemProgram.programId,
			})
			.rpc();

		console.log('Todo added:', content);
	};

	return { addTodo };
};
