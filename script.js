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



