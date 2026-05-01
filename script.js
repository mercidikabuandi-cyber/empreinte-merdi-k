document.addEventListener("DOMContentLoaded", function () {

    // 🔹 PRODUITS PAR DÉFAUT
    const produitsDefaut = [
        { nom: "Téléphone", prix: 100, image: "https://via.placeholder.com/150" },
        { nom: "Chaussures", prix: 50, image: "https://via.placeholder.com/150" },
        { nom: "Casque", prix: 25, image: "https://via.placeholder.com/150" }
    ];

    // 🔹 CHARGER PRODUITS (SAFE)
    let produits;
    try {
        const saved = localStorage.getItem("produits");
        produits = saved ? JSON.parse(saved) : produitsDefaut;
        if (!Array.isArray(produits)) produits = produitsDefaut;
    } catch {
        produits = produitsDefaut;
    }

    // 🔹 CHARGER PANIER
    let panier = [];
    try {
        const savedPanier = localStorage.getItem("panier");
        panier = savedPanier ? JSON.parse(savedPanier) : [];
    } catch {
        panier = [];
    }

    // 🔹 ELEMENTS HTML
    const zoneProduits = document.getElementById("produits");
    const zonePanier = document.getElementById("panier");
    const zoneTotal = document.getElementById("total");
    const inputRecherche = document.getElementById("recherche");

    const btnCommander = document.getElementById("commander");
    const btnPayer = document.getElementById("payer");
    const zoneCommande = document.getElementById("commande");

    // 🔐 ADMIN LOGIN
    const loginBox = document.getElementById("loginBox");
    const password = document.getElementById("password");
    const loginBtn = document.getElementById("loginBtn");
    const error = document.getElementById("error");
    const adminPanel = document.getElementById("adminPanel");

    const nomProduit = document.getElementById("nomProduit");
    const prixProduit = document.getElementById("prixProduit");
    const imageProduit = document.getElementById("imageProduit");
    const btnAjouter = document.getElementById("ajouterProduit");

    loginBtn.onclick = function () {
        if (password.value === "EMK@2026") {
            loginBox.style.display = "none";
            adminPanel.style.display = "block";
            error.textContent = "";
        } else {
            error.textContent = "❌ Mot de passe incorrect";
        }
    };

    // ➕ AJOUT PRODUIT
    btnAjouter.onclick = function () {

        const nom = nomProduit.value.trim();
        const prix = parseFloat(prixProduit.value);
        const image = imageProduit.value.trim();

        if (!nom || isNaN(prix) || !image) {
            alert("Remplis correctement !");
            return;
        }

        produits.push({ nom, prix, image });

        localStorage.setItem("produits", JSON.stringify(produits));

        afficherProduits();

        nomProduit.value = "";
        prixProduit.value = "";
        imageProduit.value = "";
    };

    // 🛍 PRODUITS
    function afficherProduits(list = produits) {

        zoneProduits.innerHTML = "";

        list.forEach(p => {

            const div = document.createElement("div");

            const img = document.createElement("img");
            img.src = p.image;
            img.style.width = "100%";

            const txt = document.createElement("p");
            txt.textContent = `${p.nom} - ${p.prix}$`;

            const btn = document.createElement("button");
            btn.textContent = "Acheter";

            btn.onclick = function () {
                panier.push(p);
                sauvegarderPanier();
                afficherPanier();
            };

            div.appendChild(img);
            div.appendChild(txt);
            div.appendChild(btn);

            zoneProduits.appendChild(div);
        });
    }

    // 🛒 PANIER
    function afficherPanier() {

        zonePanier.innerHTML = "";
        let total = 0;

        panier.forEach((p, i) => {

            const li = document.createElement("li");
            li.textContent = `${p.nom} - ${p.prix}$ `;

            const btn = document.createElement("button");
            btn.textContent = "❌";

            btn.onclick = function () {
                panier.splice(i, 1);
                sauvegarderPanier();
                afficherPanier();
            };

            li.appendChild(btn);
            zonePanier.appendChild(li);

            total += p.prix;
        });

        zoneTotal.textContent = "Total : " + total + "$";
    }

    function sauvegarderPanier() {
        localStorage.setItem("panier", JSON.stringify(panier));
    }

    // 🔍 RECHERCHE
    inputRecherche.addEventListener("input", function () {

        const t = inputRecherche.value.toLowerCase();

        const f = produits.filter(p =>
            p.nom.toLowerCase().includes(t)
        );

        afficherProduits(f);
    });

    // 🧾 COMMANDER
    btnCommander.onclick = function () {

        zoneCommande.style.display = "block";

        let total = 0;
        let html = "<h3>🧾 Résumé commande</h3>";

        panier.forEach(p => {
            html += `<p>${p.nom} - ${p.prix}$</p>`;
            total += p.prix;
        });

        html += `<h3>Total : ${total}$</h3>`;

        zoneCommande.innerHTML = html;
    };

    // 💳 PAIEMENT
    btnPayer.onclick = function () {

        if (panier.length === 0) {
            alert("Panier vide !");
            return;
        }

        let total = panier.reduce((sum, p) => sum + p.prix, 0);

        zoneCommande.style.display = "block";

        zoneCommande.innerHTML = `
            <h2>💳 Paiement</h2>
            <p><strong>Total :</strong> ${total}$</p>

            <p>📱 +243 995 950 008</p>
            <p>👤 Bialusiku Kabuandi Merdi</p>

            <input type="file" id="preuve" accept="image/*"><br><br>

            <img id="preview" style="max-width:200px; display:none;"><br><br>

            <button id="confirmer" disabled>✔ Confirmer paiement</button>
        `;

        const input = document.getElementById("preuve");
        const preview = document.getElementById("preview");
        const btn = document.getElementById("confirmer");

        input.onchange = function () {
            const file = input.files[0];

            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    preview.src = e.target.result;
                    preview.style.display = "block";
                    btn.disabled = false;
                };
                reader.readAsDataURL(file);
            }
        };

        btn.onclick = function () {

            panier = [];
            localStorage.removeItem("panier");
            afficherPanier();

            zoneCommande.innerHTML = `
                <h2>🧾 Reçu</h2>
                <p>Total payé : ${total}$</p>
                <p style="color:green;">✔ Paiement validé</p>
            `;
        };
    };

    // 🚀 LANCEMENT
    afficherProduits();
    afficherPanier();

});