const API_URL = "http://localhost:3000";

const budgetForm =
    document.getElementById("budgetForm");

const expenseForm =
    document.getElementById("expenseForm");

const budgetList =
    document.getElementById("budgetList");

const token =
    localStorage.getItem("token");

if (!token) {

    window.location.href =
        "telaLogin.html";

}

function formatMoney(value) {

    return Number(value).toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );

}

async function loadBudgets() {

    try {

        const response = await fetch(
            `${API_URL}/budgets`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const budgets =
            await response.json();

        const expenseBudget =
            document.getElementById(
                "expenseBudget"
            );

        expenseBudget.innerHTML = `
            <option value="">
                Selecione um orçamento
            </option>
        `;

        budgetList.innerHTML = "";

        budgets.forEach(budget => {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                budget.id;

            option.textContent =
                `${budget.name} - ${formatMoney(
                    budget.remaining
                )}`;

            expenseBudget.appendChild(
                option
            );

            const div =
                document.createElement(
                    "div"
                );

            div.innerHTML = `

                <h3>${budget.name}</h3>

                <p>
                    Valor:
                    ${formatMoney(
                        budget.amount
                    )}
                </p>

                <p>
                    Gasto:
                    ${formatMoney(
                        budget.totalSpent
                    )}
                </p>

                <p>
                    Restante:
                    ${formatMoney(
                        budget.remaining
                    )}
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

        console.error(
            "Erro ao carregar orçamentos:",
            error
        );

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
                            "application/json",
                        Authorization:
                            `Bearer ${token}`
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
                    "expenseBudget"
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
                            "application/json",
                        Authorization:
                            `Bearer ${token}`
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

async function deleteBudget(id) {

    try {

        await fetch(
            `${API_URL}/budgets/${id}`,
            {
                method: "DELETE",
                headers: {
                    Authorization:
                        `Bearer ${token}`
                }
            }
        );

        loadBudgets();

    } catch (error) {

        console.error(error);

    }

}

function logout() {

    localStorage.removeItem(
        "token"
    );

    localStorage.removeItem(
        "usuario"
    );

    window.location.href =
        "telaLogin.html";

}

loadBudgets();