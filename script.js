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

