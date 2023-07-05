import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/SearchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import { async } from 'regenerator-runtime';

// // import icons from '../img/icons.svg'; // parcel 1
// import icons from 'url:../img/icons.svg'; // parcel 2

// import 'core-js/stable';
// import 'regenerator-runtime/runtime';
// import { async } from 'regenerator-runtime';

// if (module.hot) {
//   module.hot.accept();
// }

// const recipeContainer = document.querySelector('.recipe');

// const timeout = function (s) {
//   return new Promise(function (_, reject) {
//     setTimeout(function () {
//       reject(new Error(`Request took too long! Timeout after ${s} second`));
//     }, s * 1000);
//   });
// };

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

// const renderSpinner = function (parentEl) {
//   const markup = `
//   <div class="spinner">
//           <svg>
//             <use href="${icons}#icon-loader"></use>
//           </svg>
//         </div>`;
//   parentEl.innerHTML = '';
//   parentEl.insertAdjacentHTML('afterbegin', markup);
// };

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    // console.log(id);

    if (!id) return;
    // renderSpinner(recipeContainer);
    recipeView.renderSpinner();

    //0) update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());

    //3) Updating bookmarks view
    bookmarksView.update(model.state.bookmarks);

    //1) Loading recipe
    //loadrecipe is asynchronous function
    // console.log(model.loadRecipe(id));
    await model.loadRecipe(id);
    // const { recipe } = model.state;

    /*const res = await fetch(
      // `https://forkify-api.herokuapp.com/api/v2/recipes/5ed6604591c37cdc054bcc40`
      `https://forkify-api.herokuapp.com/api/v2/recipes/${id}`
    );
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);

    // console.log(res, data);

    // let recipe = data.data.recipe;
    let { recipe } = data.data;
    recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceUrl: recipe.source_url,
      image: recipe.image_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
    };
    console.log(recipe);*/

    //2) Rendering recipe
    recipeView.render(model.state.recipe);
    /*// const recipeView = new recipeView(model.state.recipe);

    //   const markup = `
    // <figure class="recipe__fig">
    //   <img src="${recipe.image}" alt="${recipe.title}" class="recipe__img" />
    //   <h1 class="recipe__title">
    //     <span>${recipe.title}</span>
    //   </h1>
    // </figure>

    // <div class="recipe__details">
    //   <div class="recipe__info">
    //     <svg class="recipe__info-icon">
    //       <use href="${icons}#icon-clock"></use>
    //     </svg>
    //     <span class="recipe__info-data recipe__info-data--minutes">${
    //       recipe.cookingTime
    //     }</span>
    //     <span class="recipe__info-text">minutes</span>
    //   </div>
    //   <div class="recipe__info">
    //     <svg class="recipe__info-icon">
    //       <use href="${icons}#icon-users"></use>
    //     </svg>
    //     <span class="recipe__info-data recipe__info-data--people">${
    //       recipe.servings
    //     }</span>
    //     <span class="recipe__info-text">servings</span>

    //     <div class="recipe__info-buttons">
    //       <button class="btn--tiny btn--increase-servings">
    //         <svg>
    //           <use href="${icons}#icon-minus-circle"></use>
    //         </svg>
    //       </button>
    //       <button class="btn--tiny btn--increase-servings">
    //         <svg>
    //           <use href="${icons}#icon-plus-circle"></use>
    //         </svg>
    //       </button>
    //     </div>
    //   </div>

    //   <div class="recipe__user-generated">
    //     <svg>
    //       <use href="${icons}#icon-user"></use>
    //     </svg>
    //   </div>
    //   <button class="btn--round">
    //     <svg class="">
    //       <use href="${icons}#icon-bookmark-fill"></use>
    //     </svg>
    //   </button>
    // </div>

    // <div class="recipe__ingredients">
    //   <h2 class="heading--2">Recipe ingredients</h2>
    //   <ul class="recipe__ingredient-list">
    //   ${recipe.ingredients
    //     .map(ing => {
    //       return `<li class="recipe__ingredient">
    //     <svg class="recipe__icon">
    //       <use href="${icons}#icon-check"></use>
    //     </svg>
    //     <div class="recipe__quantity">${ing.quantity}</div>
    //     <div class="recipe__description">
    //       <span class="recipe__unit">${ing.unit}</span>
    //       ${ing.description}
    //     </div>
    //   </li>`;
    //     })
    //     .join('')}
    //     </ul>
    // </div>

    // <div class="recipe__directions">
    //   <h2 class="heading--2">How to cook it</h2>
    //   <p class="recipe__directions-text">
    //     This recipe was carefully designed and tested by
    //     <span class="recipe__publisher">${
    //       recipe.publisher
    //     }</span>. Please check out
    //     directions at their website.
    //   </p>
    //   <a
    //     class="btn--small recipe__btn"
    //     href="${recipe.sourceUrl}"
    //     target="_blank"
    //   >
    //     <span>Directions</span>
    //     <svg class="search__icon">
    //       <use href="${icons}#icon-arrow-right"></use>
    //     </svg>
    //   </a>
    // </div>`;

    //   recipeContainer.innerHTML = '';
    //   recipeContainer.insertAdjacentHTML('afterbegin', markup);

    // TEST 301
    // controlServings();*/
  } catch (err) {
    // console.error(err.message);
    recipeView.renderError();
    console.error(err);
  }
};
// controlRecipes();
// window.addEventListener('hashchange', controlRecipes);
// window.addEventListener('load', controlRecipes);
// ['hashchange', 'load'].forEach(ev =>
//   window.addEventListener(ev, controlRecipes)
// );

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    //1) get search query
    const query = searchView.getQuery();
    if (!query) return;

    //2)load search results
    await model.loadSearchResults(query);

    //3)render results
    // console.log(model.state.search.results);
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());

    //4) Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.error(err);
  }
};
// controlSearchResults();

const controlPagination = function (goToPage) {
  //1)render NEW page results
  resultsView.render(model.getSearchResultsPage(goToPage));

  //2) Render NEW pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  //Update the recipe servings (in state)
  model.updateServings(newServings);

  // Update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  //1) Add/remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  //2) Update recipe view
  // console.log(model.state.recipe);
  recipeView.update(model.state.recipe);

  //3) Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    //show loading spinner
    addRecipeView.renderSpinner();

    // console.log(newRecipe);
    //Upload the new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    //render recipe
    recipeView.render(model.state.recipe);

    //success message
    addRecipeView.renderMessage();

    //render bookmark view
    bookmarksView.render(model.state.bookmarks);

    //change ID in url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    //close from window
    setTimeout(() => {
      addRecipeView.toggleWindow();
      location.reload(); //added myself
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('😑', err);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  // controlServings();
};
init();
