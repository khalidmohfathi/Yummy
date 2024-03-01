/// <reference types="../@types/jquery"/>

// Loading
$(function () {
   $('#loading').fadeOut(1000, function () {
      $('#loading').css('z-index', '100');
   });
   $('body').css('overflow', 'auto');
})

// SideBar
function openClose() {
   let width = $('#sidelist').width();
   if ($('#side').css('left') == '0px') {
      $('#side').animate({ left: width }, 500);
      for (let i = 0; i < 5; i++) {
         $(".links li").eq(i).animate({
            top: 0
         }, (i + 1) * 200)
      }
      $('#sideButton').removeClass('fa-bars');
      $('#sideButton').addClass('fa-xmark');
   }
   else {
      $('#side').animate({ left: 0 }, 500);
      $(".links li").animate({ top: 400 }, 500);
      $('#sideButton').removeClass('fa-xmark');
      $('#sideButton').addClass('fa-bars');
   }

}

// SideBar Event (na2sa)
$('#sideButton').on('click', openClose)

// Get Search Meals
async function searchMeals(type = 's', name = '') {
   $('#loading').fadeIn(250);
   let data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?${type}=${name}`)
   data = await data.json();
   displayMeals(data);
   $('#loading').fadeOut(250);
}

// Display Search Meals
function displayMeals(data) {
   let meals = data.meals;
   if (meals != null) {
      let cartona = ``;
      for (let i = 0; i < Math.min(20, meals.length); ++i) {
         cartona += `
         <div class="col-md-3">
            <div class="rounded-3 cursor outline" onclick="getMealDetails('${meals[i].idMeal}')">
               <img src="${meals[i].strMealThumb}" class="w-100" alt="">
               <div class="overlay">
                  <h3>${meals[i].strMeal}</h3>
               </div>
            </div>
         </div>
         `
      }
      $('#main').html(cartona);
   } else {
      $('#main').html('');
   }
}

async function getMealDetails(id) {
   $('#loading').fadeIn(250);
   let data = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
   data = await data.json();
   displayMealDetails(data.meals[0]);
   $('#loading').fadeOut(250);
}

function displayMealDetails(meals) {
   $('#main').css('display', 'none');
   $('#search_area').css('display', 'none');
   let cartona = ``, recipes = ``, tags = [];
   for (let i = 1; ; ++i) {
      if (!meals[`strIngredient${i}`])
         break;
      recipes += `<span class="alert alert-info m-1 p-1 d-inline-block">${meals[`strMeasure${i}`]} ${meals[`strIngredient${i}`]}</span>`;
   }
   if (meals.strTags != null) {
      tags = meals.strTags.split(',');
      for (let i = 0; i < tags.length; ++i) {
         cartona += `<span class="alert alert-danger mx-1 p-1 d-inline-block">${tags[i]}</span>`
      }
   } else {
      cartona = `<span class="alert alert-danger mx-1 p-1">None</span>`;
   }
   $('.container').append(`
   <div id="detail" class="row p-5 bg-black">
      <div class="col-md-4">
         <img src="${meals.strMealThumb}" class="w-100 rounded-2">
         <h2 class="text-white">${meals.strMeal}</h2>
      </div>
      <div class="col-md-8 text-white">
         <i class="fa-solid fa-xmark fa-2x detail-cross" onclick="closeDetail()"></i>
         <h2>Instructions</h2>
         <p>${meals.strInstructions}</p>
         <h3>Area : <span class="fw-light">${meals.strArea}</span></h3>
         <h3>Categories : <span class="fw-light">${meals.strCategory}</span></h3>
         <h3>Recipes : </h3>
         <div class="my-3 ms-2">
            ${recipes}
         </div>
         <h3>Tags : </h3>
         <div class="mt-3 mb-5 ms-2">
            ${cartona}
         </div>
         <div>
            <a href="${meals.strSource}" class="btn btn-success me-2">Source</a>
            <a href="${meals.strYoutube}" class="btn btn-danger me-2">Youtube</a>
         </div>
      </div>
   </div>
   `)
}

function closeDetail() {
   $('#detail').remove();
   $('#main').css('display', 'flex');
   if ($(".container").has("#search_area").length)
      $('#search_area').css('display', 'block');
}

// Home Call
searchMeals();

// SideBar Search Click
$('#search').on('click', function () {
   openClose();
   $('#search_area').html(`
      <div class="row g-3 px-5 my-4">
         <div class="col-md-6">
            <input onkeyup="searchName(this.value)" type="text" class="form-control" placeholder="Search by Name">
         </div>
         <div class="col-md-6">
            <input onkeyup="searchFirst(this.value)" maxlength="1" type="text" class="form-control"
            placeholder="Search by First Letter">
         </div>
      </div>
   `);
   if ($(".container").has("#detail").length)
      closeDetail();
   $('#main').html('');
})

// RealTime Name Search
function searchName(name) {
   searchMeals('s', name);
}

// RealTime First Letter Search
function searchFirst(name) {
   if (name != '') {
      searchMeals('f', name);
   }
   else {
      $('#main').html('');
   }
}

async function getCategories() {
   $('#loading').fadeIn(250);
   let data = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`)
   data = await data.json();
   displayCategories(data);
   $('#loading').fadeOut(250);
}

function displayCategories(data) {
   let categories = data.categories;
   let cartona = ``;
   for (let i = 0; i < Math.min(20, categories.length); ++i) {
      cartona += `
         <div class="col-md-3">
            <div class="rounded-3 cursor outline" onclick="CategMeals('${categories[i].strCategory}')">
               <img src="${categories[i].strCategoryThumb}" class="w-100" alt="">
               <div class="overlay">
                  <h3>${categories[i].strCategory}</h3>
                  <p class="overflow-y-scroll px-2">${categories[i].strCategoryDescription}</p>
               </div>
            </div>
         </div>
      `
   }
   $('#main').html(cartona);
}

// SideBar Categories Click
$('#categories').on('click', function () {
   openClose();
   $('#search_area').html('');
   if ($(".container").has("#detail").length)
      closeDetail();
   getCategories();
})

async function CategMeals(name) {
   $('#loading').fadeIn(250);
   let data = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${name}`)
   data = await data.json();
   displayMeals(data);
   $('#loading').fadeOut(250);
}

async function getArea() {
   $('#loading').fadeIn(250);
   let data = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`)
   data = await data.json();
   displayArea(data);
   $('#loading').fadeOut(250);
}

function displayArea(data) {
   let area = data.meals;
   let cartona = ``;
   for (let i = 0; i < area.length; ++i) {
      cartona += `
      <div class="col-md-3 text-center text-white">
         <div class="cursor" onclick="AreaMeals('${area[i].strArea}')">
            <i class="fa-solid fa-earth-africa fa-4x my-3"></i>
            <h3>${area[i].strArea}</h3>
         </div>
      </div> 
      `
   }
   $('#main').html(cartona);
}

async function AreaMeals(name) {
   $('#loading').fadeIn(250);
   let data = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${name}`)
   data = await data.json();
   displayMeals(data);
   $('#loading').fadeOut(250);
}

$('#area').on('click', function () {
   openClose();
   $('#search_area').html('');
   if ($(".container").has("#detail").length)
      closeDetail();
   getArea();
})

async function getIngredients() {
   $('#loading').fadeIn(250);
   let data = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`)
   data = await data.json();
   displayIngredients(data);
   $('#loading').fadeOut(250);
}

function displayIngredients(data) {
   let ingredients = data.meals;
   let cartona = ``;
   for (let i = 0; i < Math.min(20, ingredients.length); ++i) {
      cartona += `
      <div class="col-md-3 text-center text-white">
         <div class="cursor" onclick="IngredientsMeal('${ingredients[i].strIngredient}')">
            <img src="https://www.themealdb.com/images/ingredients/${ingredients[i].strIngredient}.png" class="w-50">
            <h3 class="my-2">${ingredients[i].strIngredient}</h3>
            <p>${ingredients[i].strDescription.substring(0, 95)}</p>
         </div>
      </div>
      `
   }
   $('#main').html(cartona);
}

async function IngredientsMeal(name) {
   $('#loading').fadeIn(250);
   let data = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${name}`)
   data = await data.json();
   displayMeals(data);
   $('#loading').fadeOut(250);
}

$('#ingredients').on('click', function () {
   openClose();
   $('#search_area').html('');
   if ($(".container").has("#detail").length)
      closeDetail();
   getIngredients();
})

let numberReg = /^(\+2)?[0-9]{11}$/
let nameReg = /^[a-zA-Z]{1,}$/
let ageReg = /^[1-9][0-9]?$/
let emailReg = /^[a-z]{2,}@[a-z]{2,}\.[a-z]{2,}$/
let passwordReg = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/

function nameValid() {
   return nameReg.test($('#name').val());
}
function numberValid() {
   return numberReg.test($('#phone').val());
}
function ageValid() {
   return ageReg.test($('#age').val());
}
function emailValid() {
   return emailReg.test($('#email').val());
}
function passwordValid() {
   return passwordReg.test($('#password').val());
}
function repasswordValid() {
   return ($('#password').val() == $('#repassword').val());
}

function InputCheck() {
   if (!nameValid()) {
      $("#name").addClass("is-invalid");
      $("#nameAlert").removeClass("d-none");
   }
   else {
      $("#name").addClass("is-valid");
      $("#name").removeClass("is-invalid");
      $("#nameAlert").addClass("d-none");
   }
   if ($('#name').val() == "") {
      $("#name").removeClass("is-invalid");
      $("#name").removeClass("is-valid");
      $("#nameAlert").addClass("d-none");
   }
   if (!emailValid()) {
      $("#email").addClass("is-invalid");
      $("#emailAlert").removeClass("d-none");
   }
   else {
      $("#email").addClass("is-valid");
      $("#email").removeClass("is-invalid");
      $("#emailAlert").addClass("d-none");
   }
   if ($('#email').val() == "") {
      $("#email").removeClass("is-invalid");
      $("#email").removeClass("is-valid");
      $("#emailAlert").addClass("d-none");
   }

   if (!numberValid()) {
      $("#phone").addClass("is-invalid");
      $("#phoneAlert").removeClass("d-none");
   }
   else {
      $("#phone").addClass("is-valid");
      $("#phone").removeClass("is-invalid");
      $("#phoneAlert").addClass("d-none");
   }
   if ($('#phone').val() == "") {
      $("#phone").removeClass("is-invalid");
      $("#phone").removeClass("is-valid");
      $("#phoneAlert").addClass("d-none");
   }

   if (!ageValid()) {
      $("#age").addClass("is-invalid");
      $("#ageAlert").removeClass("d-none");
   }
   else {
      $("#age").addClass("is-valid");
      $("#age").removeClass("is-invalid");
      $("#ageAlert").addClass("d-none");
   }
   if ($('#age').val() == "") {
      $("#age").removeClass("is-invalid");
      $("#age").removeClass("is-valid");
      $("#ageAlert").addClass("d-none");
   }

   if (!passwordValid()) {
      $("#password").addClass("is-invalid");
      $("#passwordAlert").removeClass("d-none");
   }
   else {
      $("#password").addClass("is-valid");
      $("#password").removeClass("is-invalid");
      $("#passwordAlert").addClass("d-none");
   }
   if ($('#password').val() == "") {
      $("#password").removeClass("is-invalid");
      $("#password").removeClass("is-valid");
      $("#passwordAlert").addClass("d-none");
   }

   if (!repasswordValid()) {
      $("#repassword").addClass("is-invalid");
      $("#repasswordAlert").removeClass("d-none");
   }
   else {
      $("#repassword").addClass("is-valid");
      $("#repassword").removeClass("is-invalid");
      $("#repasswordAlert").addClass("d-none");
   }
   if ($('#repassword').val() == "") {
      $("#repassword").removeClass("is-invalid");
      $("#repassword").removeClass("is-valid");
      $("#repasswordAlert").addClass("d-none");
   }
   if (nameValid() && emailValid() && numberValid() && ageValid() && passwordValid() && repasswordValid()) {
      $('#submitButton').removeClass("disabled");
   } else {
      $('#submitButton').addClass("disabled");
   }

}

$('#contactUs').on('click', function () {
   openClose();
   $('#search_area').html('');
   if ($(".container").has("#detail").length)
      closeDetail();
   $('#main').html(`
   <div class="w-75 text-center mx-auto mt-5 pt-5">
   <div class="row g-4 my-4">
      <div class="col-md-6 contact">
         <input id="name" type="text" class="form-control" placeholder="Enter Your Name"
            onkeyup="InputCheck()">
         <div id="nameAlert" class="alert alert-danger mt-2 p-2 d-none">Special characters and numbers not
            allowed</div>
      </div>
      <div class="col-md-6 contact">
         <input id="email" type="text" class="form-control" placeholder="Enter Your Email"
            onkeyup="InputCheck()">
         <div id="emailAlert" class="alert alert-danger mt-2 p-2 d-none">Email not valid *exemple@yyy.zzz
         </div>
      </div>
      <div class="col-md-6 contact">
         <input id="phone" type="tel" class="form-control" placeholder="Enter Your Phone"
            onkeyup="InputCheck()">
         <div id="phoneAlert" class="alert alert-danger mt-2 p-2 d-none">Enter valid Phone Number</div>
      </div>
      <div class="col-md-6 contact">
         <input id="age" type="number" class="form-control" placeholder="Enter Your Age"
            onkeyup="InputCheck()">
         <div id="ageAlert" class="alert alert-danger mt-2 p-2 d-none">Enter valid age</div>
      </div>
      <div class="col-md-6 contact">
         <input id="password" type="password" class="form-control" placeholder="Enter Your Password"
            onkeyup="InputCheck()">
         <div id="passwordAlert" class="alert alert-danger mt-2 px-1 py-2 d-none">Enter valid password
            <p class="m-0 p-0">*Minimum eight characters, at least one letter and one number:*</p>
         </div>
      </div>
      <div class="col-md-6 contact">
         <input id="repassword" type="password" class="form-control" placeholder="Repassword"
            onkeyup="InputCheck()">
         <div id="repasswordAlert" class="alert alert-danger mt-2 p-2 d-none">Enter valid repassword</div>
      </div>
   </div>
   <button id="submitButton" class="btn btn-outline-danger disabled">Submit</button>
</div>

   
   
   `)
})






