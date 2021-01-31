const modal = {
    open() {
        let abrir = document.querySelector('.modal-overlay').classList.add('active')

    },
    close() {
        let fechar = document.querySelector('.modal-ovelay').classList.remove('active')
    }
}

const Storage ={
    get(){
        return JSON.parse(localStorage.getItem("dev.finances:transactions")) || []
    },
    set(transactions){
        localStorage.setItem("dev.finances:transactions", JSON.stringify(transactions))
    },
}


const Transaction = {
    all: Storage.get(),

    add(transaction) {
        Transaction.all.push(transaction)

        App.reload()
    },

    remove(index) {
        Transaction.all.splice(index, 1);

        App.reload();
    },

    incomes() {
        let income = 0;

        Transaction.all.forEach(transition => {
            if (transition.amount > 0) {
                income += transition.amount;
            }
        })

        return income;
    },
    expenses() {
        let expanse = 0;

        Transaction.all.forEach(transition => {
            if (transition.amount < 0) {
                expanse += transition.amount;
            }
        })

        return expanse
    },
    total() {
        let total = Transaction.incomes() + Transaction.expenses()

        return total
    }
}

const DOM = {
    transitionsContainer: document.querySelector('#data-table tbody'),


    addTransaction(transition, index) {
        const tr = document.createElement('tr');

        tr.innerHTML = DOM.innerHTMLTransition(transition, index);
        tr.dataset.index = index;

        DOM.transitionsContainer.appendChild(tr);
    },

    innerHTMLTransition(transitions, index) {

        const CSSclass = transitions.amount > 0 ? "income" : "expense";

        const amount = Ultis.formatCurrency(transitions.amount)

        const html = `
                <td class="description">${transitions.description}</td>
                <td class="${CSSclass}">${amount}</td>
                <td class="date">${transitions.date}</td>
                <td>
                    <img onclick="Transaction.remove(${index})" src="./image/minus.svg" alt="Remover Transação">
                </td>
            `

        return html
    },

    updateBalance() {
        document.getElementById('incomeDisplay').innerHTML = Ultis.formatCurrency(Transaction.incomes());

        document.getElementById('expanseDisplay').innerHTML = Ultis.formatCurrency(Transaction.expenses());

        document.getElementById('totalDisplay').innerHTML = Ultis.formatCurrency(Transaction.total());
    },

    clearTransaction() {
        DOM.transitionsContainer.innerHTML = ''
    }
}

const Ultis = {
    formatAmount(value) {
        value = Number(value) * 100;
        return value;
    },

    formatDate(date) {
        const splittedDate = date.split('-');
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    },

    formatCurrency(value) {
        const signal = Number(value) < 0 ? '-' : '';

        value = String(value).replace(/\D/g, "")

        value = Number(value) / 100

        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })

        return signal + value
    }
}

const App = {
    init() {

        Transaction.all.forEach(DOM.addTransaction);

        DOM.updateBalance();
        Storage.set(Transaction.all);


    },

    reload() {
        DOM.clearTransaction();

        App.init()

    },

}

const Form = {
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),
   

    getValues() {
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value,
        }
    },

    validateField() {
        const { description, amount, date } = Form.getValues();

        if (description.trim() === "" || amount.trim() === "" || date.trim() === "") {
            throw new Error("Por favor, preencha todos os campos")
        }

        
    },

    formatValues() {
        let { description, amount, date } = Form.getValues();
        amount = Ultis.formatAmount(amount);
        date = Ultis.formatDate(date);
        return {
            description,
            amount,
            date
        }
    },

    clearFields() {
        Form.description.value = "",
        Form.amount.value = "",
        Form.date.value = ""
    },

    submit(event) {
        event.preventDefault();

        try {
            Form.validateField();
            const transaction =  Form.formatValues();

            Transaction.add(transaction);

            Form.clearFields();
            modal.close();
        

        } catch (error) {
            alert(error.message)
        }

       

    }
}


Storage.get()

Transaction.add({
    description: 'alou',
    amount: 200,
    date: '25/01/2021'
})

Transaction.remove(0)




