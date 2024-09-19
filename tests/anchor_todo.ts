
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

  // Keypair for the todo account
  const todoAccount = anchor.web3.Keypair.generate();

  it("Should initialize the ToDo account", async () => {
    // Call the initialize function
    await program.methods
      .initialize()
      .accounts({
        todoAccount: todoAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([todoAccount])
      .rpc();

    // Fetch the account and verify the todos vector is empty
    const account = await program.account.todoAccount.fetch(todoAccount.publicKey);
    assert.equal(account.todos.length, 0, "ToDo list should be empty after initialization");
  });

  it("Should add a ToDo item", async () => {
    const todoContent = "Write TypeScript tests";

    // Call the add_todo function
    await program.methods
      .addTodo(todoContent)
      .accounts({
        todoAccount: todoAccount.publicKey,
      })
      .rpc();

    // Fetch the account and verify the todo was added
    const account = await program.account.todoAccount.fetch(todoAccount.publicKey);
    assert.equal(account.todos.length, 1, "There should be 1 ToDo item");
    assert.equal(account.todos[0].content, todoContent, "Content should match the added ToDo");
    assert.equal(account.todos[0].marked, false, "ToDo should not be marked initially");
  });

  it("Should mark a ToDo item", async () => {
    const todoIndex = new anchor.BN(0);

    // Call the mark_todo function
    await program.methods
      .markTodo(todoIndex)
      .accounts({
        todoAccount: todoAccount.publicKey,
      })
      .rpc();

    // Fetch the account and verify the todo was marked
    const account = await program.account.todoAccount.fetch(todoAccount.publicKey);
    assert.equal(account.todos[0].marked, true, "ToDo item should be marked as complete");
  });
});
