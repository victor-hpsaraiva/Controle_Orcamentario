const API_URL = "http://localhost:3000";

const budgetForm = document.getElementById("budgetForm");
const expenseForm = document.getElementById("expenseForm");
const budgetList = document.getElementById("budgetList");

const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "telaLogin.html";
}

function formatMoney(value) {
  return Number(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

async function loadBudgets() {

  console.log("Carregando orçamentos...");
  try {
    const response = await fetch(`${API_URL}/budgets`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const budgets = await response.json();

    const expensesResponse = await fetch(`${API_URL}/expenses`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const expenses = await expensesResponse.json();

    const expenseBudget = document.getElementById("expenseBudget");

    expenseBudget.innerHTML = `
            <option value="">
                Selecione um orçamento
            </option>
        `;

    budgetList.innerHTML = "";

    budgets.forEach((budget) => {
      const despesasDoOrcamento = expenses.filter (
        (item) => String(item.budgetId) === String(budget.id),
      );

      const historicoHTML = despesasDoOrcamento
        .map(
          (item) => `
                    
                    <tr>
                        <td>${item.description}</td>
                        <td>${item.category}</td>
                        <td>${formatMoney(item.amount)}</td>
                    </tr>

                `,
        )
        .join("");

      const option = document.createElement("option");

      option.value = budget.id;

      option.textContent = `
                ${budget.name}
                -
                ${formatMoney(budget.remaining)}
            `;

      expenseBudget.appendChild(option);

      const div = document.createElement("div");

div.innerHTML = `

<div class="budget-container">

    <div class="block1">

        <h3>${budget.name}</h3>

        <p>Valor: ${formatMoney(budget.amount)}</p>

        <p>Gasto: ${formatMoney(budget.totalSpent)}</p>

        <p>Resto: ${formatMoney(budget.remaining)}</p>

        <p>Status: ${budget.status}</p>

        <div class="actions-budget">

            <button
                onclick="deleteBudget('${budget.id}')"
            >
                Excluir
            </button>

        </div>

    </div>

    <div class="block2">

        <h3>Histórico</h3>

        <details>

            <summary>Ver Histórico</summary>

            <table>

                <thead>
                    <tr>
                        <th>Descrição</th>
                        <th>Categoria</th>
                        <th>Valor</th>
                    </tr>
                </thead>

                <tbody>

                    ${historicoHTML}

                </tbody>

            </table>

        </details>

    </div>

                </div>


            `;

      budgetList.appendChild(div);
    });
  } catch (error) {
    console.error("Erro ao carregar orçamentos:", error);
  }
}

budgetForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const name = document.getElementById("budgetName").value;

  const amount = Number(document.getElementById("budgetAmount").value);

  try {
    await fetch(`${API_URL}/budgets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name,
        amount,
      }),
    });

    budgetForm.reset();

    loadBudgets();
  } catch (error) {
    console.error(error);
  }
});

expenseForm.addEventListener("submit", async (event) => {
  event.preventDefault();

const budgetId =document.getElementById("expenseBudget").value;

  const description = document.getElementById("expenseDescription").value;

  const category = document.getElementById("expenseCategory").value;

  const amount = Number(document.getElementById("expenseAmount").value);

  try {
    await fetch(`${API_URL}/expenses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        budgetId,
        description,
        category,
        amount,
      }),
    });

    expenseForm.reset();

    loadBudgets();
  } catch (error) {
    console.error(error);
  }
});

async function deleteBudget(id) {

    console.log("Excluindo orçamento:", id);

    try {

        const response = await fetch(
            `${API_URL}/budgets/${id}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const data = await response.json();

        console.log(data);

        if (!response.ok) {
            alert(data.error || "Erro ao excluir orçamento.");
            return;
        }

        loadBudgets();

    } catch (error) {

        console.error(error);

        alert("Erro ao excluir orçamento.");

    }

}

   window.addEventListener("DOMContentLoaded", () => {

    const token = localStorage.getItem("token");

    if (!token) {

        window.location.href =
            "telaLogin.html";

        return;
    }

    loadBudgets();

});
