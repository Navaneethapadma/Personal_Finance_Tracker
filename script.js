// javascript object Notification.its is text based format to represent data in
// both human and michine Readable. commenly used to transmit the data between web application 
// and client and Server . 
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let totalIncome = 0;
let totalExpense = 0;

const transactionList = document.getElementById('transaction-list');
const totalIncomeDisplay = document.getElementById('total-income');
const totalExpenseDisplay = document.getElementById('total-expense');
const totalSavingsDisplay = document.getElementById('total-savings');
const expenseChartCanvas = document.getElementById('expenseChart').getContext('2d');

document.getElementById('transaction-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const description = document.getElementById('description').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const date = document.getElementById('date').value;
    const category = document.getElementById('category').value;
    const type = document.getElementById('type').value;

    const transaction = { description, amount, date, category, type };
    transactions.push(transaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));

    updateUI();
    this.reset();
});

function updateUI() {
    transactionList.innerHTML = '';
    totalIncome = 0;
    totalExpense = 0;

    const expenseCategories = { food: 0, rent: 0, entertainment: 0, other: 0 };
    const incomeCategories = { food: 0, rent: 0, entertainment: 0, other: 0 }; // New for income

    transactions.forEach((transaction, index) => {
        const li = document.createElement('li');
        li.innerHTML = `${transaction.description} - $${transaction.amount} (${transaction.category}, ${transaction.date}) 
                        <button onclick="deleteTransaction(${index})">Delete</button>`;
        transactionList.appendChild(li);

        if (transaction.type === 'income') {
            totalIncome += transaction.amount;
            incomeCategories[transaction.category] += transaction.amount; 
        } else {
            totalExpense += transaction.amount;
            expenseCategories[transaction.category] += transaction.amount; 
        }
    });

    totalIncomeDisplay.innerText = totalIncome.toFixed(2);
    totalExpenseDisplay.innerText = totalExpense.toFixed(2);
    totalSavingsDisplay.innerText = (totalIncome - totalExpense).toFixed(2);

    updateChart(expenseCategories, incomeCategories);
}

function deleteTransaction(index) {
    transactions.splice(index, 1);
    localStorage.setItem('transactions', JSON.stringify(transactions));
    updateUI();
}

let barChart;

function updateChart(categories, incomeData) {
    if (barChart) {
        barChart.destroy(); 
    }

    barChart = new Chart(expenseChartCanvas, {
        type: 'bar',  
        data: {
            labels: ['Food', 'Rent', 'Entertainment', 'Other'], 
            datasets: [
                {
                    label: 'Expenses',
                    data: [categories.food, categories.rent, categories.entertainment, categories.other], // Expense data
                    backgroundColor: '#ff6384' 
                },
                {
                    label: 'Income',
                    data: [incomeData.food, incomeData.rent, incomeData.entertainment, incomeData.other], // Income data
                    backgroundColor: '#36a2eb' 
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

updateUI();