let responses = [];
const userResponsesSection = document.querySelector('#user-responses');


const fetchUserResponses = async () => {
  const response = await fetch(
    'http://cors-anywhere.herokuapp.com/https://docs.google.com/spreadsheets/d/e/2PACX-1vRlfsW_69UVHfzhWeunjtt-c1TmEi_dRrTNtMoCNK3l0fR-3oSAs2o8BjsGssfQHIjp04orLj3IprA5/pub?output=csv'
    );
  const data = await response.text();
  const results = Papa.parse(data, {header: true});
  responses = results.data;
  
};

const renderUserResponse = userResponse => {
  const name = userResponse["What is your name? "];
  const restaurantName = userResponse["Name one of your favorite restaurants in the Miami area."];
  const restaurantWebsite = userResponse["Please provide a link to the restaurant's website."];
  const love = userResponse["Why do you love this restaurant? "];
  const cuisine = userResponse["What type of cuisine does the restaurant serve?"];
  const greatFor = userResponse["This restaurant is great for (check all that apply):"];
  const mustTry = userResponse["Tell us your favorite \"must try\" item on the menu."];
  const restaurantPic = userResponse["Upload a picture of the restaurant or the food you ate."];
  const googlePhotoId = restaurantPic.split('id=')[1];
  const greatForListItems = greatFor.split(', ');
  console.log(greatForListItems);
  const greatForListArray = greatForListItems.map( item => {
    return `
      <li>&#10003${item}</li>`
  }).join("")  
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


const FetchAndShowResponses = async () => {
  await fetchUserResponses();
  const eachUserResponseHTML = responses.map(renderUserResponse);
  const allUserResponsesHTML = eachUserResponseHTML.join("");
  userResponsesSection.innerHTML = allUserResponsesHTML; 
}

FetchAndShowResponses();
