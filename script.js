const form = document.querySelector(".add");
let transactions = localStorage.getItem("transactions") !== null ? JSON.parse(localStorage.getItem("transactions")) : [];
const incomeList = document.querySelector("ul.income-list")
const expenselist = document.querySelector("ul.expense-list")

const balance = document.getElementById("balance");
const income = document.getElementById("income");
const expense = document.getElementById("expenses");





function genrateTemplate(id,source,amount,time){
    return ` <li data-id="${id}">
    <p>
        <span>${source}</span>
        <span id="time">${time}</span>
    </p>
    <span>$ ${Math.abs(amount)}</span>
    <i class="bi bi-trash-fill delete"></i>
</li>`

}

function addTransactionDom(id,source,amount,time){
     
    if(amount>0){
        incomeList.innerHTML += genrateTemplate(id,source,amount,time);
    }
    else{
        expenselist.innerHTML += genrateTemplate(id,source,amount,time);
    }
}


function addTransaction(source, amount) {
    const time = new Date();
    const transaction = {
        id: Math.floor(Math.random() * 10000),
        source: source,
        amount: amount,
        time: `${time.toLocaleDateString()} ${time.toLocaleTimeString()}`
    };
    transactions.push(transaction); // Push transaction inside the function
    localStorage.setItem("transactions", JSON.stringify(transactions)); // Update local storage here
    addTransactionDom(transaction.id,source,amount,transaction.time);
}

form.addEventListener("submit", event => {
    event.preventDefault();
    if(form.source.value.trim() === "" || form.amount.value === "" ){
        return alert("Please Add Proper Values!")
    }
    addTransaction(form.source.value, form.amount.value);
    updatedStatistics();
    form.reset();

});

function getTransaction(){
    transactions.forEach(transaction => {
        if(transaction.amount>0){
            incomeList.innerHTML += genrateTemplate(transaction.id,transaction.source,transaction.amount,transaction.time);
        } else{

            expenselist.innerHTML += genrateTemplate(transaction.id,transaction.source,transaction.amount,transaction.time);
        }
        
    });
}
    getTransaction();


function deleteTransaction(id){
   transactions = transactions.filter(transaction=>{
    console.log(transaction.id,id);    
    return transaction.id !== id;

    });
    localStorage.setItem("transactions",JSON.stringify(transactions));
}


    incomeList.addEventListener("click",event=>{
        if(event.target.classList.contains("delete")){
           event.target.parentElement.remove(Number(event.target.parentElement.dataset.id));
           let id = event.target.parentElement.dataset.id;
           deleteTransaction(Number(id)); 
           // Call the deleteTransaction function
           updatedStatistics();
        }
    })

    expenselist.addEventListener("click",event=>{
        if(event.target.classList.contains("delete")){
            event.target.parentElement.remove(Number(event.target.parentElement.dataset.id));
            let id = event.target.parentElement.dataset.id;
            deleteTransaction(Number(id)); // Call the deleteTransaction function
            updatedStatistics();
        }
    }); 
    
    
    function updatedStatistics() {
        const updatedIncome = transactions
        .filter(transaction=>transaction.amount > 0)
        .reduce((total, transaction) => total += Math.abs( transaction. amount), 0)
    
        console.log(updatedIncome);
    
        const updatedExpenses = transactions
        .filter(transaction => transaction.amount < 0)
        .reduce((total, transaction) => total += Math.abs(transaction. amount), 0)
        console.log(updatedExpenses);
         balance.textContent = updatedIncome - updatedExpenses; 
        income.textContent = updatedIncome;
        expenses.textContent = updatedExpenses;
    }
    
    updatedStatistics();
    
function init(){
    updatedStatistics();
    getTransaction();
}    
init();