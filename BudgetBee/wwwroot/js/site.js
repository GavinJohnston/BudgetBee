// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.

const uri = '';

displayPots();
getMaxAmount();
getTotal();

(function currentDate() {
    var date = new Date().toLocaleDateString();

    let datetext = document.getElementsByClassName("dateText");

    for (let i = 0; i < datetext.length; i++) {
        datetext[i].innerHTML = `${date}`;
    };

})(); 

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

    viewerPopulate();
}

function addPot(potName) {

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

async function getPot(id) {

    let data = await fetch(`${uri}/pots/${id}`)
        .then(response => response.json())
        .catch(error => console.error('Unable to get items.', error));

    return data;
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
        Category: formValues.Category,
        PotName: formValues.potLists,
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
            viewSavedTransaction();
            valueToPot(potId, parseFloat(formValues.Amount), form);
            document.getElementById("depositAmount").value = "";
            document.getElementById("withdrawAmount").value = "";
        })
        .catch(error => console.error('Unable to add item.', error));
}

async function getTransactions() {

    let data = await fetch(`${uri}/transaction`)
        .then(response => response.json())
        .catch(error => console.error('Unable to get items.', error));

    return data;
}

async function viewSavedTransaction() {

    const history = document.getElementById("historyTable");

    var transactions = await getTransactions();

    var transaction = transactions[transactions.length - 1];

    let row = document.createElement('tr');

    row.setAttribute("class", "historyItem");

    let html =
        `
    <td>£ ${transaction.amount}</td>
    <td>${transaction.date.split('T')[0].split('-').reverse().join('/')}
    </td>
    <td>${transaction.category}</td>
    <td>${transaction.potName}</td>
    <td>${transaction.direction}</td>`

    row.innerHTML = html;

    let historyItems = document.getElementsByClassName("historyItem");

    while (historyItems.length >= 20) {
        historyItems[0].parentNode.removeChild(historyItems[0]);
    }

    history.appendChild(row);
}

(async function viewSavedTransactions() {
    const history = document.getElementById("historyTable");

    var transactions = await getTransactions();

    var pots = await getPots();

        for (var i = 0; i < transactions.length; i++) {
            let row = document.createElement('tr');

            row.setAttribute("class", "historyItem");

            let html =
            `<td>£ ${transactions[i].amount}</td>
            <td>${transactions[i].date.split('T')[0].split('-').reverse().join('/')}
            </td>
            <td>category</td>
            <td>${transactions[i].potName}</td>
            <td>${transactions[i].direction}</td>`

            row.innerHTML += html;

            let historyItems = document.getElementsByClassName("historyItem");

            while (historyItems.length >= 20) {
                historyItems[0].parentNode.removeChild(historyItems[0]);
            }

            history.appendChild(row);
        }
})();

async function getMaxAmount() {

    var potData = await getPots();

    const potName = document.getElementById("withdrawPots").value;

    const MaxAmount = document.getElementById("withdrawAmount");

    let potAmount;

    potData.forEach(item => {
        if (item.name == potName) {
            potAmount = item.amount;
        }
    });

    if (potAmount !== undefined) {
        MaxAmount.setAttribute("placeholder", `MAX: £${potAmount}`);
    } else {
        MaxAmount.setAttribute("placeholder", `MAX: £000.00`);
    }
}

async function valueToPot(potId, newAmount, direction) {
    
    let potData = await getPot(potId);

    potAmount = potData.amount;

    let finalAmount;

    if (direction == "deposit") {
        finalAmount = potAmount + newAmount;

        fetch(`pots/${potId}`, {
            method: 'PATCH',
            body: JSON.stringify(
                [
                    {
                        "path": "/Amount",
                        "value": finalAmount,
                        "op": "replace"
                    }
                ]),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        })
            .then(() => {
                getMaxAmount();
                getTotal();
            })
            .catch(error => console.error('Unable to update item.', error));
    } else {
        finalAmount = potAmount - newAmount;

        fetch(`pots/${potId}`, {
            method: 'PATCH',
            body: JSON.stringify(
                [
                    {
                        "path": "/Amount",
                        "value": finalAmount,
                        "op": "replace"
                    }
                ]),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        })
            .then(() => {
                getMaxAmount();
                getTotal();
            })
            .catch(error => console.error('Unable to update item.', error));
    }
}

async function transferFunds() {

    var pots = await getPots();

    let fromPotName = document.getElementById("fromPot").value;
    let toPotName = document.getElementById("toPot").value;
    let transferAmount = document.getElementById("transferAmount").value;

    let toPotId;
    let toPotAmount;
    let toFinal;

    let fromPotId;
    let fromPotAmount;
    let fromFinal;

    console.log(pots);

    pots.forEach(item => {
        if (item.name == fromPotName) {
            toPotId = item.id;
            toPotAmount = item.amount;
        }
        if (item.name == toPotName) {
           fromPotId = item.id
            fromPotAmount = item.amount;
        }
    });

    toFinal = toPotAmount - transferAmount;
    fromFinal = fromPotAmount + parseFloat(transferAmount);

    fetch(`pots/${toPotId}`, {
        method: 'PATCH',
        body: JSON.stringify(
            [
                {
                    "path": "/Amount",
                    "value": toFinal,
                    "op": "replace"
                }
            ]),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    })
        .catch(error => console.error('Unable to update item.', error));

    fetch(`pots/${fromPotId}`, {
        method: 'PATCH',
        body: JSON.stringify(
            [
                {
                    "path": "/Amount",
                    "value": fromFinal,
                    "op": "replace"
                }
            ]),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    })
        .then(() => {
            getMaxAmount();
            document.getElementById("transferAmount").value = "";
        })
        .catch(error => console.error('Unable to update item.', error));
}

async function viewerPopulate() {
        var pots = await getPots();

        let parent = document.getElementById("potViewer");

        parent.innerHTML = "";

        pots.forEach(item => {

            let pot = document.createElement("div");
            pot.setAttribute("class", "pot");

            html =
                `
        <div class="potContent">
        <h1 class="potContentName">
            ${item.name}
        </h1>
        <h1 class="potContentAmount">
            ${item.amount}
                </h1>
        </div>
        <div class="potDeleteBtn" onclick="deletePot(${item.id})">Delete</div>
        `

            pot.innerHTML = html;

            parent.appendChild(pot);
        })
}

async function deletePot(id) {
        var pot = await getPot(id);

        fetch(`${uri}/pots/${id}`, {
            method: 'DELETE'
        })
            .then(() => {
                document.getElementById("potViewer").innerHTML = "";
                viewerPopulate();
            })
            .then(() => {
                
            })
            .catch(error => console.error('Unable to delete item.', error));
};

async function getTotal() {
    var pots = await getPots();

    let totalAmount = 0;

    pots.forEach(item => {
        totalAmount = totalAmount + item.amount;
    })

    let totalBox = await document.getElementById("totalBox");

    totalBox.innerHTML = `TOTAL <br> £${totalAmount.toFixed(2)}`;
}

function formValidation(direction) {

    let items = document.getElementsByClassName(`${direction}Item`);

    let validationBoxes = document.getElementsByClassName(`${direction}ValidationBoxes`);

    for (let i = 0; i < items.length; i++) {
        if (items[i].value.length == 0) {
            validationBoxes[i].classList.add("cross");
        }
    }

    let crosses = document.getElementsByClassName("cross");

    if (crosses.length > 0) {
        return;
    } else {
        for (let i = 0; i < items.length; i++) {
            validationBoxes[i].classList.remove("cross");
        }
        addTransaction(direction);
    }
}

function potGenerator() {

    var potName = document.getElementById("potName").value;

    let validationBox = document.getElementsByClassName("nameValidationBox");

    if (potName.length > 0) {
        addPot(potName);
    } else {
        validationBox[0].classList.add("cross");
    }
}

function resetForm() {

    let crosses = document.getElementsByClassName("cross");

    for (let i = 0; i < crosses.length; i++) {
        crosses[i].classList.remove("cross");
    }


}