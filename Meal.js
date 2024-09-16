let categoriesData = [];
let mealsData = [];

document.getElementById('hamburger').addEventListener('click', function () {
    document.getElementById('sidebar').classList.toggle('open');
    clearSection('categories-section');
    fetchCategories();
});

fetch('https://www.themealdb.com/api/json/v1/1/categories.php')
    .then(response => response.json())
    .then(data => {
        categoriesData = data.categories; 
        const categoriesDiv = document.getElementById('categories');

        data.categories.forEach(category => {
            const categoryName = document.createElement('div');
            categoryName.textContent = category.strCategory;
            categoryName.classList.add('category-name');

            categoryName.addEventListener('click', function () {
                clearSection('categories-section'); 
                clearSection('meals');
                clearSection('meal-info'); 
                displayCategoryInfo(category); 
                fetchMealsByCategory(category.strCategory); 

                const categoryInfo = document.getElementById('category-info');

                categoryInfo.style.border = '3px solid orange';
                categoryInfo.style.margin = '40px 60px 10px 60px';

                const categoryInfoH3 = categoryInfo.querySelector('h3');
                categoryInfoH3.style.fontSize = '30px';
                categoryInfoH3.style.marginBottom = '20px';

                const categoryInfoP = categoryInfo.querySelector('p');
                categoryInfoP.style.fontSize = '20px';

                document.getElementById('sidebar').classList.remove('open');
            });

            categoriesDiv.appendChild(categoryName);
        });
    })
    .catch(error => console.error('Error fetching categories:', error));

function displayCategoryInfo(category) {
    const categoryInfoDiv = document.getElementById('category-info');
    categoryInfoDiv.innerHTML = '';

    // const categoryInfoHeading = document.createElement('h2');
    // categoryInfoHeading.textContent = 'Category';
    // categoryInfoDiv.appendChild(categoryInfoHeading);

    const h3 = document.createElement('h3');
    h3.textContent = category.strCategory;

    const p = document.createElement('p');
    p.textContent = category.strCategoryDescription;

    categoryInfoDiv.appendChild(h3);
    categoryInfoDiv.appendChild(p);

        categoryInfoDiv.style.border = '3px solid orange';
        categoryInfoDiv.style.margin = '40px 60px 10px 60px';
    
        const categoryInfoH3 = categoryInfoDiv.querySelector('h3');
        categoryInfoH3.style.fontSize = '30px';
        categoryInfoH3.style.marginBottom = '20px';
    
        const categoryInfoP = categoryInfoDiv.querySelector('p');
        categoryInfoP.style.fontSize = '20px';
    }

function fetchCategories() {
    fetch('https://www.themealdb.com/api/json/v1/1/categories.php')
        .then(response => response.json())
        .then(data => {
            categoriesData = data.categories;

            const categoriesDiv = document.getElementById('categories-section');
            categoriesDiv.innerHTML = '';

            // const categoriesHeading = document.createElement('h2');
            // categoriesHeading.textContent = 'Categories';
            // categoriesDiv.appendChild(categoriesHeading);

            const categoriesHeading = document.createElement('h2');
            categoriesHeading.textContent = 'Categories';
            categoriesDiv.appendChild(categoriesHeading);

            const categoriesHr = document.createElement('hr');
            categoriesDiv.appendChild(categoriesHr);

            const fragment = document.createDocumentFragment();

            data.categories.forEach(category => {
                const categoryItem = document.createElement('div');
                categoryItem.classList.add('category-item');

                const img = document.createElement('img');
                img.src = category.strCategoryThumb;
                img.alt = category.strCategory;

                const h3 = document.createElement('h3');
                h3.textContent = category.strCategory;

                categoryItem.appendChild(img);
                categoryItem.appendChild(h3);

                categoryItem.addEventListener('click', function() {
                    clearSection('categories-section'); 
                    displayCategoryInfo(category);
                    fetchMealsByCategory(category.strCategory);
                    document.getElementById('sidebar').classList.remove('open');
                });

                fragment.appendChild(categoryItem);
            });

            categoriesDiv.appendChild(fragment);
        })
        .catch(error => console.error('Error fetching categories:', error));
}

function fetchMealsByCategory(categoryName) {
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoryName}`)
        .then(response => response.json())
        .then(data => {
            mealsData = data.meals;
            console.log('Fetched meals:', data.meals);

            const mealsDiv = document.getElementById('meals');
            mealsDiv.innerHTML = '';

            const mealsHeading = document.createElement('h2');
            mealsHeading.textContent = 'Meals';
            mealsDiv.appendChild(mealsHeading);

            const mealsHr = document.createElement('hr');
            mealsDiv.appendChild(mealsHr);

            const fragment = document.createDocumentFragment();

            data.meals.forEach(meal => {
                const mealItem = document.createElement('div');
                mealItem.classList.add('meal-item');

                const img = document.createElement('img');
                img.src = meal.strMealThumb;
                img.alt = meal.strMeal;

                const h3 = document.createElement('h3');
                h3.textContent = meal.strMeal;

                mealItem.appendChild(img);
                mealItem.appendChild(h3);

                mealItem.addEventListener('click', function() {
                    clearSection('meals'); 
                    clearSection('category-info');
                    displayMealInfo(meal.idMeal);
                    document.getElementById('sidebar').classList.remove('open');
                });

                fragment.appendChild(mealItem);
            });

            mealsDiv.appendChild(fragment);
            fetchCategories();

            moveCategoriesBelowMeals();
        })
        .catch(error => console.error('Error fetching meals:', error));
}

function moveCategoriesBelowMeals() {
    const categoriesSection = document.getElementById('categories-section');
    const mealInfoSection = document.getElementById('meal-info');
    const main = document.querySelector('main');

    if (categoriesSection && mealInfoSection) {
        if (categoriesSection.parentElement) {
            categoriesSection.parentElement.removeChild(categoriesSection);
        }

        if (mealInfoSection) {
            main.insertBefore(categoriesSection, mealInfoSection.nextSibling);
        } else {
            main.appendChild(categoriesSection);
        }
    }
}

function displayMealInfo(mealId) {
    clearSection('category-info');
    const mealInfoDiv = document.getElementById('meal-info');

    const categoryInfo = document.getElementById('category-info');
    categoryInfo.style.border = '';
    categoryInfo.style.margin = '';

    const categoryInfoH3 = categoryInfo.querySelector('h3');
    const categoryInfoP = categoryInfo.querySelector('p');

    if (categoryInfoH3) {
        categoryInfoH3.style.fontSize = '';
        categoryInfoH3.style.marginBottom = '';
    }

    if (categoryInfoP) {
        categoryInfoP.style.fontSize = '';
    }


    mealInfoDiv.innerHTML = '';
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
        .then(response => response.json())
        .then(data => {
            const meal = data.meals[0];

            const mealInfoHeading = document.createElement('h2');
            mealInfoHeading.textContent = 'Mealinfo';
            mealInfoDiv.appendChild(mealInfoHeading);

            // const mealInfoHr = document.createElement('hr');
            // mealInfoDiv.appendChild(mealInfoHr);

            const img = document.createElement('img');
            img.src = meal.strMealThumb;
            img.alt = meal.strMeal;

            const h3 = document.createElement('h3');
            h3.textContent = meal.strMeal;

            const pCategory = document.createElement('p');
            pCategory.textContent = `Category: ${meal.strCategory}`;
            pCategory.classList.add('cat');

            // const pArea = document.createElement('p');
            // pArea.textContent = `Area: ${meal.strArea}`;
            // pArea.classList.add('area');

            const pTags = document.createElement('p');
            pTags.textContent = `Tags: ${meal.strTags || 'N/A'}`;
            pTags.classList.add('tags');

            const pYouTubeLink = document.createElement('p');
            pYouTubeLink.innerHTML = `Source: <a href="${meal.strYoutube || 'Not available'}" target="_blank">${meal.strYoutube || 'Not available'}</a>`;
            pYouTubeLink.classList.add('youtube');

            const pIngredients = document.createElement('p');
            pIngredients.textContent = 'Ingredients:';
            pIngredients.classList.add('ingred');
            const ingredientsList = document.createElement('ul');
            ingredientsList.classList.add('ingredients-list');

            const pMeasures = document.createElement('p');
            pMeasures.textContent = 'Measures:';
            pMeasures.classList.add('measures');
            const measuresList = document.createElement('ul');
            measuresList.classList.add('measures-list');

            for (let i = 1; i <= 20; i++) {
                const ingredient = meal[`strIngredient${i}`];
                const measure = meal[`strMeasure${i}`];
                if (ingredient && ingredient.trim() !== '') {
                    const ingredientItem = document.createElement('li');
                    ingredientItem.textContent = ingredient;
                    ingredientsList.appendChild(ingredientItem);

                    const measureItem = document.createElement('li');
                    measureItem.innerHTML = `<i class="fas fa-spoon"></i> ${measure}`;
                    measuresList.appendChild(measureItem);
                }
            }

            const pInstructions = document.createElement('p');
            pInstructions.textContent = 'Instructions:';
            pInstructions.classList.add('instructions');
            const instructionsList = document.createElement('ul');
            instructionsList.classList.add('instructions-list');

            meal.strInstructions.split('\n').forEach(instruction => {
                if (instruction.trim() !== '') {
                    const instructionItem = document.createElement('li');

                    instructionItem.innerHTML = `<i class="fa-solid fa-square-check"></i> ${instruction}`;

                    instructionsList.appendChild(instructionItem);
                }
            });

            mealInfoDiv.appendChild(img);
            mealInfoDiv.appendChild(h3);
            mealInfoDiv.appendChild(pCategory);
            // mealInfoDiv.appendChild(pArea);
            mealInfoDiv.appendChild(pTags);
            mealInfoDiv.appendChild(pYouTubeLink);
            mealInfoDiv.appendChild(pIngredients);
            mealInfoDiv.appendChild(ingredientsList);
            mealInfoDiv.appendChild(pMeasures);
            mealInfoDiv.appendChild(measuresList);
            mealInfoDiv.appendChild(pInstructions);
            mealInfoDiv.appendChild(instructionsList);

            moveCategoriesBelowMeals();

            const mealsDiv = document.getElementById('meals');
            mealsDiv.innerHTML = '';
        })
        .catch(error => console.error('Error fetching meal info:', error));
}


fetchCategories();

// document.getElementById('meal-info').addEventListener('click', function(){
//     clearSection('category-info');
// });

document.getElementById('categories-section').addEventListener('click', function () {
    clearSection('meal-info');
});

function clearSection(sectionId) {
    document.getElementById(sectionId).innerHTML = '';
    if (sectionId === 'meal-info') {
        const categoriesSection = document.getElementById('categories-section');
        const main = document.querySelector('main');
        if (categoriesSection && main) {
            main.appendChild(categoriesSection);
        }
    }
}

document.getElementById('home-button').addEventListener('click', function () {
    clearSection('categories-section');
    clearSection('meals');
    clearSection('meal-info');
    clearSection('category-info');
    
    const categoryInfo = document.getElementById('category-info');
    categoryInfo.style.border = '';
    categoryInfo.style.margin = '';

    const categoryInfoH3 = categoryInfo.querySelector('h3');
    const categoryInfoP = categoryInfo.querySelector('p');

    if (categoryInfoH3) {
        categoryInfoH3.style.fontSize = '';
        categoryInfoH3.style.marginBottom = '';
    }

    if (categoryInfoP) {
        categoryInfoP.style.fontSize = '';
    }

    fetchCategories(); 
    moveCategoriesBelowMeals();
});

document.getElementById('search-btn').addEventListener('click', function () {
    const searchQuery = document.getElementById('search-input').value.toLowerCase();

    const category = categoriesData.find(cat => cat.strCategory.toLowerCase() === searchQuery);
    
    if (category) {
        clearSection('categories-section'); 
        clearSection('meals'); 
        displayCategoryInfo(category); 
        fetchMealsByCategory(category.strCategory); 
    } else {
        const matchedMeals = mealsData.filter(meal => meal.strMeal.toLowerCase().includes(searchQuery));

        if (matchedMeals.length > 0) {
            clearSection('categories-section'); 
            clearSection('meals'); 

            const mealsDiv = document.getElementById('meals');
            mealsDiv.innerHTML = '';

            const fragment = document.createDocumentFragment();

            matchedMeals.forEach(meal => {
                const mealItem = document.createElement('div');
                mealItem.classList.add('meal-item');

                const img = document.createElement('img');
                img.src = meal.strMealThumb;
                img.alt = meal.strMeal;

                const h3 = document.createElement('h3');
                h3.textContent = meal.strMeal;

                mealItem.appendChild(img);
                mealItem.appendChild(h3);

                mealItem.addEventListener('click', function() {
                    clearSection('meals'); 
                    clearSection('category-info');
                    displayMealInfo(meal.idMeal); 
                });

                fragment.appendChild(mealItem);
            });

            mealsDiv.appendChild(fragment);
        } else {
            alert('No results found');
        }
    }
    clearSection('category-info');
    fetchCategories();
});