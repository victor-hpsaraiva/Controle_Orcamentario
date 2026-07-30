const API_URL = "http://localhost:3000";

const budgetForm = document.getElementById("budgetForm");
const expenseForm = document.getElementById("expenseForm");

const budgetList = document.getElementById("budgetList");

function formatMoney(value) {
    return Number(value).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

function showMessage(text) {
    console.log(text);
}

async function loadBudgets() {

    try {

        const response = await fetch(
            `${API_URL}/budgets`
        );

        const budgets =
            await response.json();

        budgetList.innerHTML = "";

        budgets.forEach(budget => {

            const div =
                document.createElement("div");

            div.innerHTML = `

                <h3>${budget.name}</h3>

                <p>
                    Valor:
                    ${formatMoney(budget.amount)}
                </p>

                <p>
                    Gasto:
                    ${formatMoney(budget.totalSpent)}
                </p>

                <p>
                    Restante:
                    ${formatMoney(budget.remaining)}
                </p>

                <p>
                    Status:
                    ${budget.status}
                </p>

                <button
                    onclick="deleteBudget(${budget.id})"
                >
                    Excluir
                </button>

                <hr>

            `;

            budgetList.appendChild(div);

        });

    } catch (error) {

        console.error(error);

    }
}

budgetForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();

        const name =
            document.getElementById(
                "budgetName"
            ).value;

        const amount =
            Number(
                document.getElementById(
                    "budgetAmount"
                ).value
            );

        try {

            const response = await fetch(
                `${API_URL}/budgets`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                        "application/json"
                    },
                    body: JSON.stringify({
                        name,
                        amount
                    })
                }
            );

            const data =
                await response.json();

            console.log(data);

            budgetForm.reset();

            loadBudgets();

        } catch (error) {

            console.error(error);

        }

    }
);

expenseForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();

        const budgetId =
            Number(
                document.getElementById(
                    "expenseBudgetId"
                ).value
            );

        const description =
            document.getElementById(
                "expenseDescription"
            ).value;

        const category =
            document.getElementById(
                "expenseCategory"
            ).value;

        const amount =
            Number(
                document.getElementById(
                    "expenseAmount"
                ).value
            );

        try {

            const response = await fetch(
                `${API_URL}/expenses`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                        "application/json"
                    },
                    body: JSON.stringify({
                        budgetId,
                        description,
                        category,
                        amount
                    })
                }
            );

            const data =
                await response.json();

            console.log(data);

            expenseForm.reset();

            loadBudgets();

        } catch (error) {

            console.error(error);

        }

    }
);

async function deleteBudget(id){

    try{

        await fetch(
            `${API_URL}/budgets/${id}`,
            {
                method:"DELETE"
            }
        );

        loadBudgets();

    }catch(error){

        console.error(error);

    }
}

loadBudgets();