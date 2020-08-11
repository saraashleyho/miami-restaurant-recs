let responses = [];
const userResponsesSection = document.querySelector('#user-responses');

const cuisineSelect = document.querySelector('#cuisine')
const occasionSelect = document.querySelector('#occasion')
const searchInput = document.querySelector('#search')


const fetchUserResponses = async () => {
  const response = await fetch(
    'https://cors-anywhere.herokuapp.com/https://docs.google.com/spreadsheets/d/e/2PACX-1vRlfsW_69UVHfzhWeunjtt-c1TmEi_dRrTNtMoCNK3l0fR-3oSAs2o8BjsGssfQHIjp04orLj3IprA5/pub?output=csv'
  );
  const data = await response.text();
  const results = Papa.parse(data, { header: true });
  responses = results.data;
};

const renderUserResponse = userResponse => {
  const name = userResponse['What is your name? '];
  const restaurantName =
    userResponse['Name one of your favorite restaurants in the Miami area.'];
  const restaurantWebsite =
    userResponse["Please provide a link to the restaurant's website."];
  const love = userResponse['Why do you love this restaurant? '];
  const cuisine =
    userResponse['What type of cuisine does the restaurant serve?'];
  const greatFor =
    userResponse['This restaurant is great for (check all that apply):'];
  const mustTry =
    userResponse['Tell us your favorite "must try" item on the menu.'];
  const restaurantPic =
    userResponse['Upload a picture of the restaurant or the food you ate.'];
  const googlePhotoId = restaurantPic.split('id=')[1];
  const greatForListItems = greatFor.split(', ');
  console.log(greatForListItems)
  const greatForListArray = greatForListItems
    .map(
      item => `
      <li>&#10003${item}</li>`
    )
    .join('');
  return `
    <div class = "user-response"> 
      <a href="${restaurantWebsite}">
        <img id = "restaurant-pic" src= "https://drive.google.com/thumbnail?id=${googlePhotoId}" alt="restaurant-pic"/>
      </a>
        <h2><a href="${restaurantWebsite}">${restaurantName}</a></h2>
       <h3>${name}'s fave</h3>
       <div class = "quotation">
         <span class = "mark">&#8220</span>
          <span>
           <p id = "quote"> ${love}</p>
            </span>
          <span class = "mark">&#x201d</span>
        </div>
        <div class = "cuisine">
          <span>Cuisine:</span>
          <span>${cuisine}</span>
        </div>
        <div class = "must-and-great"
          <span>  
            <div class = "must-try">
                <h4>Must Try</h4> 
                <p class = "fave-item">${mustTry}</p>
            </div>
          </span>
          <span>
              <div class = "great-for">
               <h5>Great For</h5>
               <ul>
                  ${greatForListArray}
               </ul>
            </div>
          </span>
        </div>

        
    </div>
  `;
};


//ADDING FILTERS

const responseFilter = userResponse => {
    const cuisine = userResponse['What type of cuisine does the restaurant serve?'];
    const name = userResponse['What is your name? '];
    const restaurantName =
      userResponse['Name one of your favorite restaurants in the Miami area.'];
    const love = userResponse['Why do you love this restaurant? '];
    const mustTry =
    userResponse['Tell us your favorite "must try" item on the menu.'];
    const greatFor =
    userResponse['This restaurant is great for (check all that apply):'];
    const greatForListItems = greatFor.split(', ');
 
    const selectedCuisine = cuisineSelect.value 
    const searchTerm = searchInput.value.toLowerCase();
    const selectedOccasion = occasionSelect.value


    return (selectedCuisine === "All" || cuisine === selectedCuisine) &&
    (name.toLowerCase().includes(searchTerm) || restaurantName.toLowerCase().includes(searchTerm) ||love.toLowerCase().includes(searchTerm) || greatFor.toLowerCase().includes(searchTerm) || mustTry.toLowerCase().includes(searchTerm)|| cuisine.toLowerCase().includes(searchTerm)) &&
    (selectedOccasion === "All" || greatForListItems.includes(selectedOccasion))

    
    }

const handleFilterInput = () => {
    const filteredResults = responses.filter(responseFilter);
    userResponsesSection.innerHTML = filteredResults.map(renderUserResponse).join(""); 
}

cuisineSelect.addEventListener('input', handleFilterInput)
searchInput.addEventListener('input', handleFilterInput)
occasionSelect.addEventListener('input', handleFilterInput)

//ADDING CHART

const cuisineQuestion = 'What type of cuisine does the restaurant serve?'

const votes = {
  "American":0,
  "Japanese":0,
  "Chinese":0,
  "Steakhouse":0,
  "Indian":0,
  "Mexican":0,
  "Italian":0,
  "Mediterranean":0,
  "Asian Fusion":0,
  "Latin American":0,
  "Seafood":0,
  "Vegan / Vegetarian / Healthy Eats":0,
  "Other":0

}

const FetchAndShowResponses = async () => {
  await fetchUserResponses();
  const eachUserResponseHTML = responses.map(renderUserResponse);
  const allUserResponsesHTML = eachUserResponseHTML.join('');
  userResponsesSection.innerHTML = allUserResponsesHTML;
  responses.forEach(response => {

    votes[response[cuisineQuestion]] += 1  
    console.log(votes) 

    new Chart("pie-chart", {
      type: 'pie',
      data: {
        datasets: [{
          data: Object.values(votes),
          backgroundColor: ['#FFC0CB','#FF69B4','#FF1493', '#DB7093','#C71585','#FDBCB4','#CF6BA9','#FF77FF','#FD3F92','#FFE4E1','#FFFFFF','#FFF0F5', '#C4AEAD']
         }],
        
        labels: Object.keys(votes)
      }
    });
  })
  
};
FetchAndShowResponses();