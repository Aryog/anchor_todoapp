import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { AnchorTodo } from "../target/types/anchor_todo"; // Make sure this path points to your IDL
import { assert } from "chai";

describe("anchor_todo", () => {
  // Set the provider
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  // Get the program
  const program = anchor.workspace.AnchorTodo as Program<AnchorTodo>;

  // Variables to hold the PDA and bump for each test
  let todoAccountPDA: anchor.web3.PublicKey;
  let todoAccountBump: number;

  // Before any test, derive the PDA and initialize the ToDo account
  before(async () => {
    [todoAccountPDA, todoAccountBump] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from("todo")], // Fixed seed "todo" to match the program expectation
      program.programId
    );

    // Airdrop SOL to the provider's wallet to cover the cost of the transaction
    const airdropSignature = await provider.connection.requestAirdrop(
      provider.wallet.publicKey,
      anchor.web3.LAMPORTS_PER_SOL
    );
    await provider.connection.confirmTransaction(airdropSignature);

    // Initialize the account once
    try {
      await program.methods
        .initialize()
        .accounts({
          todoAccount: todoAccountPDA,
          user: provider.wallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();
    } catch (err) {
      // Ignore the error if the account has already been initialized
      console.log("Account already initialized, continuing with tests...");
    }
  });

  it("Should add a ToDo item", async () => {
    const todoContent = "Write TypeScript tests";

    // Call the add_todo function
    await program.methods
      .addTodo(todoContent)
      .accounts({
        todoAccount: todoAccountPDA,
      })
      .rpc();

    // Fetch the account and verify the todo was added
    const account = await program.account.todoAccount.fetch(todoAccountPDA);
    assert.equal(account.todos.length, 1, "There should be 1 ToDo item");
    assert.equal(account.todos[0].content, todoContent, "Content should match the added ToDo");
    assert.equal(account.todos[0].marked, false, "ToDo should not be marked initially");
  });

  it("Should mark a ToDo item", async () => {
    const todoIndex = new anchor.BN(0);

    // Mark the ToDo item
    await program.methods
      .markTodo(todoIndex)
      .accounts({
        todoAccount: todoAccountPDA,
      })
      .rpc();

    // Fetch the account and verify the todo was marked
    const account = await program.account.todoAccount.fetch(todoAccountPDA);
    assert.equal(account.todos[0].marked, true, "ToDo item should be marked as complete");
  });
});

