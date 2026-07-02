

const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Ajuste aqui quando quiser considerar "perto do negativo".
// Exemplo: 10 significa alerta quando sobrar 10% ou menos do orçamento.
const ALERT_PERCENTAGE = 10;

let budgets = [];
let expenses = [];
let nextBudgetId = 1;
let nextExpenseId = 1;

function toNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function findBudgetById(id) {
  return budgets.find((budget) => budget.id === Number(id));
}

function getBudgetExpenses(budgetId) {
  return expenses.filter((expense) => expense.budgetId === Number(budgetId));
}

function calculateBudgetStatus(budget) {
  const budgetExpenses = getBudgetExpenses(budget.id);
  const totalSpent = budgetExpenses.reduce((sum, item) => sum + item.amount, 0);
  const remaining = budget.amount - totalSpent;
  const alertLimit = budget.amount * (ALERT_PERCENTAGE / 100);

  let status = "ok";
  let color = "green";
  let message = "Orçamento dentro do limite.";

  if (remaining < 0) {
    status = "negative";
    color = "red";
    message = "Orçamento negativo. Gastos ultrapassaram o valor disponível.";
  } else if (remaining <= alertLimit) {
    status = "near_negative";
    color = "red";
    message = "Atenção: orçamento perto de ficar negativo.";
  }

  return {
    ...budget,
    totalSpent,
    remaining,
    alertLimit,
    status,
    color,
    message,
    expenses: budgetExpenses,
  };
}

function validateBudgetPayload(body) {
  const name = String(body.name || "").trim();
  const amount = toNumber(body.amount);

  if (!name) {
    return { error: "O campo 'name' é obrigatório." };
  }

  if (amount === null || amount <= 0) {
    return { error: "O campo 'amount' deve ser um número maior que zero." };
  }

  return { name, amount };
}

function validateExpensePayload(body) {
  const budgetId = Number(body.budgetId);
  const description = String(body.description || "").trim();
  const category = String(body.category || "Sem categoria").trim();
  const amount = toNumber(body.amount);

  if (!budgetId || !findBudgetById(budgetId)) {
    return { error: "O campo 'budgetId' é obrigatório e deve pertencer a um orçamento existente." };
  }

  if (!description) {
    return { error: "O campo 'description' é obrigatório." };
  }

  if (amount === null || amount <= 0) {
    return { error: "O campo 'amount' deve ser um número maior que zero." };
  }

  return { budgetId, description, category, amount };
}

// Rota inicial
app.get("/", (req, res) => {
  res.json({
    message: "API de Controle de Orçamento funcionando.",
    routes: {
      budgets: "/budgets",
      expenses: "/expenses",
      summary: "/summary",
    },
  });
});

// Criar orçamento
app.post("/budgets", (req, res) => {
  const validation = validateBudgetPayload(req.body);

  if (validation.error) {
    return res.status(400).json({ error: validation.error });
  }

  const budget = {
    id: nextBudgetId++,
    name: validation.name,
    amount: validation.amount,
    createdAt: new Date().toISOString(),
  };

  budgets.push(budget);

  return res.status(201).json(calculateBudgetStatus(budget));
});

// Listar todos os orçamentos com status
app.get("/budgets", (req, res) => {
  const result = budgets.map(calculateBudgetStatus);
  return res.json(result);
});

// Buscar um orçamento específico
app.get("/budgets/:id", (req, res) => {
  const budget = findBudgetById(req.params.id);

  if (!budget) {
    return res.status(404).json({ error: "Orçamento não encontrado." });
  }

  return res.json(calculateBudgetStatus(budget));
});

// Atualizar orçamento
app.put("/budgets/:id", (req, res) => {
  const budget = findBudgetById(req.params.id);

  if (!budget) {
    return res.status(404).json({ error: "Orçamento não encontrado." });
  }

  const validation = validateBudgetPayload(req.body);

  if (validation.error) {
    return res.status(400).json({ error: validation.error });
  }

  budget.name = validation.name;
  budget.amount = validation.amount;
  budget.updatedAt = new Date().toISOString();

  return res.json(calculateBudgetStatus(budget));
});

// Remover orçamento manualmente
// Também remove os gastos ligados a ele
app.delete("/budgets/:id", (req, res) => {
  const budget = findBudgetById(req.params.id);

  if (!budget) {
    return res.status(404).json({ error: "Orçamento não encontrado." });
  }

  budgets = budgets.filter((item) => item.id !== budget.id);
  expenses = expenses.filter((expense) => expense.budgetId !== budget.id);

  return res.json({ message: "Orçamento removido com sucesso.", removedBudget: budget });
});

// Criar gasto dentro de um orçamento
app.post("/expenses", (req, res) => {
  const validation = validateExpensePayload(req.body);

  if (validation.error) {
    return res.status(400).json({ error: validation.error });
  }

  const expense = {
    id: nextExpenseId++,
    budgetId: validation.budgetId,
    description: validation.description,
    category: validation.category,
    amount: validation.amount,
    createdAt: new Date().toISOString(),
  };

  expenses.push(expense);

  const budget = findBudgetById(expense.budgetId);

  return res.status(201).json({
    expense,
    budgetStatus: calculateBudgetStatus(budget),
  });
});

// Listar gastos
// Pode filtrar por orçamento: /expenses?budgetId=1
app.get("/expenses", (req, res) => {
  const { budgetId } = req.query;

  if (budgetId) {
    return res.json(getBudgetExpenses(budgetId));
  }

  return res.json(expenses);
});

// Buscar gasto específico
app.get("/expenses/:id", (req, res) => {
  const expense = expenses.find((item) => item.id === Number(req.params.id));

  if (!expense) {
    return res.status(404).json({ error: "Gasto não encontrado." });
  }

  return res.json(expense);
});

// Atualizar gasto
app.put("/expenses/:id", (req, res) => {
  const expense = expenses.find((item) => item.id === Number(req.params.id));

  if (!expense) {
    return res.status(404).json({ error: "Gasto não encontrado." });
  }

  const validation = validateExpensePayload(req.body);

  if (validation.error) {
    return res.status(400).json({ error: validation.error });
  }

  expense.budgetId = validation.budgetId;
  expense.description = validation.description;
  expense.category = validation.category;
  expense.amount = validation.amount;
  expense.updatedAt = new Date().toISOString();

  const budget = findBudgetById(expense.budgetId);

  return res.json({
    expense,
    budgetStatus: calculateBudgetStatus(budget),
  });
});

// Remover gasto manualmente
app.delete("/expenses/:id", (req, res) => {
  const expense = expenses.find((item) => item.id === Number(req.params.id));

  if (!expense) {
    return res.status(404).json({ error: "Gasto não encontrado." });
  }

  expenses = expenses.filter((item) => item.id !== expense.id);
  const budget = findBudgetById(expense.budgetId);

  return res.json({
    message: "Gasto removido com sucesso.",
    removedExpense: expense,
    budgetStatus: budget ? calculateBudgetStatus(budget) : null,
  });
});

// Resumo geral para a home/dashboard
app.get("/summary", (req, res) => {
  const totalBudget = budgets.reduce((sum, budget) => sum + budget.amount, 0);
  const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const remaining = totalBudget - totalSpent;

  let status = "ok";
  let color = "green";
  let message = "Resumo geral dentro do limite.";

  if (remaining < 0) {
    status = "negative";
    color = "red";
    message = "Resumo geral negativo.";
  } else if (totalBudget > 0 && remaining <= totalBudget * (ALERT_PERCENTAGE / 100)) {
    status = "near_negative";
    color = "red";
    message = "Resumo geral perto de ficar negativo.";
  }

  return res.json({
    totalBudget,
    totalSpent,
    remaining,
    status,
    color,
    message,
    budgets: budgets.map(calculateBudgetStatus),
  });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Erro interno no servidor.' });
});


app.listen(PORT, () => {
  console.log(`Servidor rodando na porta${PORT}`);
});

