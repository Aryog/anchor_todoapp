use anchor_lang::prelude::*;

declare_id!("DMeNA3KKDFkK6wNLYVGts4zHmfLkY64c1wTfcqapubYB");

#[program]
pub mod anchor_todo {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let todo_account = &mut ctx.accounts.todo_account;
        todo_account.todos = Vec::new();
        Ok(())
    }

    pub fn add_todo(ctx: Context<AddTodo>, content: String) -> Result<()> {
        let todo_account = &mut ctx.accounts.todo_account;
        let todo = TodoItem {
            content,
            marked: false,
        };
        todo_account.todos.push(todo);
        Ok(())
    }

    pub fn mark_todo(ctx: Context<MarkTodo>, index: u64) -> Result<()> {
        let todo_account = &mut ctx.accounts.todo_account;
        if let Some(todo) = todo_account.todos.get_mut(index as usize) {
            todo.marked = true;
            Ok(())
        } else {
            Err(ErrorCode::TodoNotFound.into())
        }
    }
    pub fn get_all_todos(ctx: Context<GetAllTodos>) -> Result<Vec<TodoItem>> {
        let todo_account = &ctx.accounts.todo_account;
        Ok(todo_account.todos.clone())
    }
}

#[derive(Accounts)] // Struct treated as the set of accounts
pub struct Initialize<'info> {
    #[account(init, payer = user, space = 9000, seeds=[b"todo"], bump)]
    pub todo_account: Account<'info, TodoAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct AddTodo<'info> {
    #[account(mut)]
    pub todo_account: Account<'info, TodoAccount>,
}

#[derive(Accounts)]
pub struct MarkTodo<'info> {
    #[account(mut)]
    pub todo_account: Account<'info, TodoAccount>,
}

#[derive(Accounts)]
pub struct GetAllTodos<'info> {
    #[account(mut)]
    pub todo_account: Account<'info, TodoAccount>,
}

#[account]
pub struct TodoAccount {
    pub todos: Vec<TodoItem>,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug)]
pub struct TodoItem {
    pub content: String,
    pub marked: bool,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Todo not found")]
    TodoNotFound,
}
