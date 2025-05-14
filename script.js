let showClients = document.getElementById("showClients");
let showReservation = document.getElementById("showReservation");
let showTickets = document.getElementById("showTickets");

showClients.onclick = () => switchSection("clients");
showReservation.onclick = () => switchSection("reservation");
showTickets.onclick = () => switchSection("tickets");
let btn = document.getElementById("toggle");
btn.onclick= function(){
    document.body.classList.toggle("Light-theme");
}
function switchSection(sectionId) {
    document.querySelectorAll(".section").forEach(section => {
        section.classList.toggle("active", section.id === sectionId);
    });
}


let clients = JSON.parse(localStorage.getItem("clients")) || [];
let tickets = JSON.parse(localStorage.getItem("tickets")) || [];


document.getElementById("clientForm").onsubmit = function (e) {
    e.preventDefault();

    let nom = document.getElementById("nomComplet").value;
    let cin = document.getElementById("cin").value;
    let estEtudiant = document.querySelector('input[name="estEtudiant"]:checked');

    
    if (clients.some(client => client.cin === cin)) {
        alert("CIN est existe déja !");
        return;
    } 
    user ={ nom:nom,
            cin:cin,
            estEtudiant:estEtudiant ? estEtudiant.value === "true" : false};

    clients.push(user);
    localStorage.setItem("clients", JSON.stringify(clients));
    ajouterclient();
    document.getElementById("clientForm").reset();
};

function ajouterclient() {
    let tbody = document.querySelector("#clientsTable tbody");
    tbody.innerHTML = clients.map((client, index) => `
        <tr>
            <td>${client.nom}</td>
            <td>${client.cin}</td>
            <td>${client.estEtudiant ? "Oui" : "Non"}</td>
            <td><button class="delete-btn" data-index="${index}">Supprimer</button></td>
        </tr>`).join("");

    
    document.querySelectorAll(".delete-btn").forEach(button => {
        button.onclick = function () {
            let index = this.dataset.index;
            clients.splice(index, 1);
            localStorage.setItem("clients", JSON.stringify(clients));
            ajouterclient();
        };
    });

    
    let clientSelect = document.getElementById("clientSelect");
    clientSelect.innerHTML = clients.map(client => `
        <option value="${client.cin}">${client.nom}(${client.cin})</option>`).join("");
}


document.getElementById("reservationForm").onsubmit = function (e) {
    e.preventDefault();

    let cin = document.getElementById("clientSelect").value;
    let destination = document.getElementById("destination").value;
    let classe = document.querySelector('input[name="classe"]:checked').value;

    let client = clients.find(client => client.cin === cin);
    if (!client) {
        alert("Client introuvable !");
        return;
    }

    let prixBase = {
        rabat: 40,
        mohammedia: 20,
        marrakech: 150,
        tanger: 290
    };

    let prix = prixBase[destination];
    if (classe === "1") {
        prix =prix * 2;
    }
    if (client.estEtudiant) {
        prix =prix * 0.8;
    }
    document.getElementById("totalPrice").textContent = `${prix.toFixed(2)} DH`;
    
    ticketriserver = {
        nom: client.nom,
        estEtudiant: client.estEtudiant,
        destination,
        classe: classe === "1" ? "1ère classe" : "2ème classe",
        prix: `${prix.toFixed(2)} DH`,
        date: new Date().toLocaleString()
    }
    tickets.push(ticketriserver);

    localStorage.setItem("tickets", JSON.stringify(tickets));
    renderTickets();
    document.getElementById("reservationForm").reset();
};

function renderTickets() {
    let tbody = document.querySelector("#ticketsTable tbody");
    tbody.innerHTML = tickets.map(ticket => `
        <tr>
            <td>${ticket.nom}</td>
            <td>${ticket.estEtudiant ? "Oui" : "Non"}</td>
            <td>${ticket.destination}</td>
            <td>${ticket.classe}</td>
            <td>${ticket.prix}</td>
            <td>${ticket.date}</td>
        </tr>`).join("");
}

ajouterclient();
renderTickets();
