async function search() {
    const query = document.getElementById("searchInput").value;
    const resultsDiv = document.getElementById("results");

    resultsDiv.innerHTML = "Ieškoma...";

    const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`
    );

    const data = await response.json();

    if (!data.meals) {
        resultsDiv.innerHTML = "Nieko nerasta 😕";
        return;
    }

    resultsDiv.innerHTML = data.meals.map(meal => `
        <div>
            <h3>${meal.strMeal}</h3>
            <img src="${meal.strMealThumb}" width="200">
        </div>
    `).join("");
}

function register() {
    const username = regUsername.value;
    const password = regPassword.value;

    if (!username || !password) {
        authMessage.innerText = "Užpildyk visus laukus";
        return;
    }

    localStorage.setItem("user", JSON.stringify({ username, password }));
    authMessage.innerText = "Paskyra sukurta ✅";
}

function login() {
    const username = loginUsername.value;
    const password = loginPassword.value;

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || user.username !== username || user.password !== password) {
        authMessage.innerText = "Neteisingi duomenys ❌";
        return;
    }

    authMessage.innerText = `Sveikas, ${username}! 👋`;
}

// function displayMeals(meals) {
//     results.innerHTML = meals.map(meal => `
//         <div onclick="showRecipe(${meal.idMeal})" style="cursor:pointer">
//             <h3>${meal.strMeal}</h3>
//             <img src="${meal.strMealThumb}" width="200">
//         </div>
//     `).join("");
// }

function displayMeals(meals) {
    results.innerHTML = meals.map(meal => `
        <div style="cursor:pointer">
            <h3>${meal.strMeal}</h3>
            <img 
                src="${meal.strMealThumb}" 
                width="200"
                onclick="showRecipe(${meal.idMeal})"
            >
        </div>
    `).join("");
}



async function searchByIngredients() {
    const input = ingredientInput.value
        .toLowerCase()
        .split(",")
        .map(i => i.trim())
        .filter(i => i !== "");

    results.innerHTML = "Filtruojama pagal ingredientus...";

    // 1. Paimam DAUG receptų (pvz. pagal paiešką be filtro)
    const response = await fetch(
        "https://www.themealdb.com/api/json/v1/1/search.php?s="
    );
    const data = await response.json();

    if (!data.meals) {
        results.innerHTML = "Nėra receptų.";
        return;
    }

    // 2. Filtruojam patys
    const filtered = data.meals.filter(meal => {
        const ingredients = [];

        for (let i = 1; i <= 20; i++) {
            const ing = meal[`strIngredient${i}`];
            if (ing) ingredients.push(ing.toLowerCase());
        }

        // tikrina ar VISI ingredientai yra recepte
        return input.every(i => ingredients.includes(i));
    });

    if (filtered.length === 0) {
        results.innerHTML = "Nerasta receptų su šiais ingredientais 😕";
        return;
    }

    displayMeals(filtered);
}


// async function showRecipe(id) {
//     const response = await fetch(
//         `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
//     );
//     const data = await response.json();
//     const meal = data.meals[0];

//     results.innerHTML = `
//         <h2>${meal.strMeal}</h2>
//         <img src="${meal.strMealThumb}" width="300">
//         <h3>Instrukcijos</h3>
//         <p>${meal.strInstructions}</p>
//     `;
// }

async function showRecipe(id) {
    const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
    );
    const data = await response.json();
    const meal = data.meals[0];

    const ingredients = getIngredients(meal)
        .map(i => `<li>${i}</li>`)
        .join("");

    results.innerHTML = `
        <h2>${meal.strMeal}</h2>
        <img src="${meal.strMealThumb}" width="300">

        <h3>Ingredientai</h3>
        <ul>
            ${ingredients}
        </ul>

        <h3>Gaminimo instrukcijos</h3>
        <p>${meal.strInstructions}</p>
    `;
}


function getIngredients(meal) {
    const list = [];

    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];

        if (ingredient && ingredient.trim() !== "") {
            list.push(`${measure} ${ingredient}`);
        }
    }

    return list;
}

// EKRANŲ PERJUNGIMAS
const loginScreen = document.getElementById("login-screen");
const registerScreen = document.getElementById("register-screen");
const appScreen = document.getElementById("app-screen");

function showLogin() {
    loginScreen.style.display = "block";
    registerScreen.style.display = "none";
    appScreen.style.display = "none";
}

function showRegister() {
    loginScreen.style.display = "none";
    registerScreen.style.display = "block";
    appScreen.style.display = "none";
}

function showApp() {
    loginScreen.style.display = "none";
    registerScreen.style.display = "none";
    appScreen.style.display = "block";
}


// REGISTRACIJA
function register() {
    const user = regUser.value;
    const pass = regPass.value;

    if (!user || !pass) {
        registerMsg.innerText = "Užpildyk visus laukus";
        return;
    }

    localStorage.setItem("user", JSON.stringify({ user, pass }));
    registerMsg.innerText = "Paskyra sukurta ✅";

    setTimeout(showLogin, 1000);
}

// LOGIN
function login() {
    const user = loginUser.value;
    const pass = loginPass.value;

    const saved = JSON.parse(localStorage.getItem("user"));

    if (!saved || saved.user !== user || saved.pass !== pass) {
        loginMsg.innerText = "Neteisingi duomenys ❌";
        return;
    }

    localStorage.setItem("loggedIn", "true");
    showApp();
}

// LOGOUT
function logout() {
    localStorage.removeItem("loggedIn");
    showLogin();
}

// ---------- RECEPTAI ----------

async function search() {
    const q = searchInput.value;
    const res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${q}`
    );
    const data = await res.json();

    if (!data.meals) {
        results.innerHTML = "Nieko nerasta";
        return;
    }

    showMeals(data.meals);
}

function showMeals(meals) {
    results.innerHTML = meals.map(m => `
        <div>
            <h3>${m.strMeal}</h3>
            <img src="${m.strMealThumb}" width="200"
                 onclick="showRecipe(${m.idMeal})"
                 style="cursor:pointer">
        </div>
    `).join("");
}

async function showRecipe(id) {
    const res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
    );
    const data = await res.json();
    const m = data.meals[0];

    const list = [];
    for (let i = 1; i <= 20; i++) {
        if (m[`strIngredient${i}`])
            list.push(`${m[`strMeasure${i}`]} ${m[`strIngredient${i}`]}`);
    }

    results.innerHTML = `
        <h2>${m.strMeal}</h2>
        <ul>${list.map(i => `<li>${i}</li>`).join("")}</ul>
        <p>${m.strInstructions}</p>
    `;
}

// INGREDIENTŲ FILTRAS
function filterByIngredients() {
    const wanted = ingredientInput.value
        .toLowerCase()
        .split(",")
        .map(i => i.trim());

    const cards = document.querySelectorAll("div");
    cards.forEach(card => {
        const text = card.innerText.toLowerCase();
        const ok = wanted.every(w => text.includes(w));
        card.style.display = ok ? "block" : "none";
    });
}

// AUTOMATINIS LOGIN
if (localStorage.getItem("loggedIn") === "true") {
    showApp();
} else {
    showLogin();
}




