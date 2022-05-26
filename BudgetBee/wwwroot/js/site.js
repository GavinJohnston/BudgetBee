// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.

const uri = '';

displayPots();

function closeModal() {
    var modalBackground = document.getElementById("modalBackground");
    var closeModalBtn = document.getElementById("modalClose");
    var potModal = document.getElementById("potModal");

    modalBackground.style.display = "none";
    potModal.style.display = "none";
}

function showModal() {
    var modalBackground = document.getElementById("modalBackground");
    var potModal = document.getElementById("potModal");

    modalBackground.style.display = "inline-block";
    potModal.style.display = "inline-block";
}

function addPot() {
    var potName = document.getElementById("potName").value;

    const item = {
        Name: potName,
        Amount: 0
    }

    fetch(`${uri}/pots`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
    })
        .then(response => response.json())
        .then(() => {
            displayPots();
        })
        .catch(error => console.error('Unable to add item.', error));

    document.getElementById("potName").value = "";
}

async function getPots() {

    let data = await fetch(`${uri}/pots`)
        .then(response => response.json())
        .catch(error => console.error('Unable to get items.', error));

    return data;
}

async function displayPots() {

    const potLists = document.getElementsByClassName("potLists");

    var data = await getPots();

    for (var i = 0; i < potLists.length; i++) {

          while (potLists[i].firstChild) {
                potLists[i].removeChild(potLists[i].firstChild);
          }

          for (var j = 0; j < data.length; j++) {
                let option = document.createElement('option');
                option.setAttribute("value", `${data[j].name}`);
                option.innerHTML = `${data[j].name}`;

                potLists[i].appendChild(option);
          }
    }
}

async function addTransaction(form) {

    var potData = await getPots();

    let potId;

    var formData = new FormData(document.getElementById(`${form}`))

    var json = JSON.stringify(Object.fromEntries(formData));

    const formValues = JSON.parse(json);

    potData.forEach(item => {
        if (item.name == formValues.potLists) {
            potId = item.id;
        }
    });

    const item = {
        Amount: parseFloat(formValues.Amount),
        Direction: `${form}`,
        PotId: potId
    };

    fetch(`${uri}/transaction`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
        })
        .then(response => response.json())
        .then(() => {
            displayTransactions();
        })
        .catch(error => console.error('Unable to add item.', error));
}

async function getTransactions() {

    let data = await fetch(`${uri}/transaction`)
        .then(response => response.json())
        .catch(error => console.error('Unable to get items.', error));

    return data;
}

async function displayTransactions() {

    const history = document.getElementById("historyTable");

    var transactions = await getTransactions();

    var transaction = transactions[transactions.length - 1];

    console.log(transaction);

    let row = document.createElement('tr');

    let html =
    `<td>${transaction.amount}</td>
    <td>${transaction.date.split('T')[0]}</td>
    <td>category</td>
    <td>pot name</td>
    <td>${transaction.direction}</td>`

    row.innerHTML = html;

    history.appendChild(row);
}