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
