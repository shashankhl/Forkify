import { async } from 'regenerator-runtime';
import { API_URL, RES_PER_PAGE, KEY } from './config.js';
// import { getJSON, sendJSON } from './helpers.js';
import { AJAX } from './helpers.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};
//obj can be manipulated
// state = {
//   ob: 'test2',
// };
// state.fav = 'test';
// console.log(state);

const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    // fav: 'test',
    // key: recipe.key
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    // const data = await getJSON(`${API_URL}${id}`);
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);

    /* // const res = await fetch(
    //   // `https://forkify-api.herokuapp.com/api/v2/recipes/${id}`
    //   `${API_URL}/${id}`
    // );
    // const data = await res.json();

    // if (!res.ok) throw new Error(`${data.message} (${res.status})`);

    // console.log(data);
    // const { recipe } = data.data;
    // state.recipe = {
    //   id: recipe.id,
    //   title: recipe.title,
    //   publisher: recipe.publisher,
    //   sourceUrl: recipe.source_url,
    //   image: recipe.image_url,
    //   servings: recipe.servings,
    //   cookingTime: recipe.cooking_time,
    //   ingredients: recipe.ingredients,
    //   fav: 'test',
    // };*/

    state.recipe = createRecipeObject(data);

    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;

    // console.log(state.recipe);
  } catch (err) {
    // temp error handling
    console.error(`${err.message}🔥`);
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    // const data = await getJSON(`${API_URL}?search=${query}`);
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    // console.log(data);

    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        sourceUrl: rec.source_url,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
    state.search.page = 1;
  } catch (err) {
    console.error(`${err.message}🔥`);
    throw err;
  }
};

// loadSearchResults('pizza');

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage; //0
  const end = page * state.search.resultsPerPage; //9

  return state.search.results.slice(start, end);
};

// export const updateServings = function (newServings) {
//   state.recipe.ingredients.forEach(ing => {
//     ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
//     //newQt=oldOt*newServings // 2*8/4=4
//   });

//   state.recipe.servings = newServings;
// };

export const updateServings = function (newServings) {
  // console.log(newServings);
  state.recipe.ingredients.forEach(ing => {
    // console.log(state.recipe.servings);
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
    // console.log(ing.quantity);
    // newQt = oldQt * newServings / oldServings // 2 * 8 / 4 = 4
  });

  state.recipe.servings = newServings;
};

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  //Add bookmark
  state.bookmarks.push(recipe);

  //Mark current recipe as bookmark
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookmarks();
};

export const deleteBookmark = function (id) {
  //Delete bookmark
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);

  //Mark current recipe as NOT bookmarked
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  persistBookmarks();
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');

  if (storage) state.bookmarks = JSON.parse(storage);
};
init();

// console.log(state.bookmarks);

const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};
// clearBookmarks()

export const uploadRecipe = async function (newRecipe) {
  try {
    // console.log(newRecipe);
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim());
        // const ingArr = ing[1].replaceAll().split(',');

        if (ingArr.length !== 3)
          throw new Error(
            'Wrong ingredient format! Please use the correct format :)'
          );

        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };
    // console.log(ingredients);
    // console.log(recipe);

    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
    // console.log(data);
  } catch (err) {
    throw err;
  }
};
