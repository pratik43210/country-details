'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');


//render countries

const renderCountries= (data, className='')=>{
    const html=`
    <article class="country ${className}">
        <img class="country__img" src="${data.flags.png}" />
        <div class="country__data">
            <h3 class="country__name">${data.name}</h3>
            <h4 class="country__region">${data.region}</h4>
            <p class="country__row"><span>👫</span>${(
                +data.population / 1000000
            ).toFixed(1)}M people</p>
            <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
            <p class="country__row"><span>💰</span>${data.currencies[0].name}</p>
        </div>
    </article>
    `;
    
    
    countriesContainer.insertAdjacentHTML('beforeend', html);
    // countriesContainer.style.opacity = 1;
}

//render error
const renderError = function (msg) {
    countriesContainer.innerHTML='';
    countriesContainer.insertAdjacentHTML('beforeend',msg);
    // countriesContainer.style.opacity=1;
}

/*
///////////////////////////////////////
//our first AJAX call: XMLHttpRequest
*/
/*
const getCountryAndNeighbour = (country)=>{
    const request= new XMLHttpRequest();
    request.open('GET',`https://restcountries.com/v2/name/${country}`);
    request.send();

    request.addEventListener('load', function(){
        //destructuring array [data]=JSON.parse(this.responseText);
        //is same as data=JSON.parse(this.responseText)[0];
        //we do this because "JSON.parse(this.responseText)"
        //gives an array having an object
        const [data] = JSON.parse(this.responseText);
        console.log(data);

        renderCountries(data);

        const [neighbour]=data.borders;

        const request2= new XMLHttpRequest();
        request2.open('GET',`https://restcountries.com/v2/alpha/${neighbour}`);
        request2.send();

        request2.addEventListener('load', function(){
            const data2 = JSON.parse(this.responseText);
            console.log(data2);
    
            renderCountries(data2, 'neighbour');

        });
    });
};

getCountryAndNeighbour('portugal');
*/




/* 
The fetch() method in JavaScript is used to request data from a server.
The request can be of any type of API that return the data in JSON or XML.
The fetch() method requires one parameter, the URL to request, and returns
a promise.
NOTE: Without options, Fetch will always act as a get request.
*/

// const request = fetch(`https://restcountries.com/v2/name/usa`);

// console.log(request);

/*
    we first create a promise and then handle it using 
    .then() method(assuming promise is fulfilled)
*/

// const getCountryData = function(country) {
//     fetch(`https://restcountries.com/v2/name/${country}`)
//     .then(function(response){
//         console.log(response);

//         /* We need to call the .json() method to read the data
//         from the response of the promise.

//         This will in turn also return a promise which we handle again 
//         by using the .then() method
//         */

//         return response.json();
//     })
//     .then(function(data){
//         console.log(data);
//         renderCountries(data[0]);
//     });

// };



/* cleaner way using arrow functions */
const getCountryAndNeighbour = function(country) {
    fetch(`https://restcountries.com/v2/name/${country}`)
        .then(response => {
            console.log(response);

            if(!response.ok)
                throw new Error(`Country not found (${response.status})`);

            return response.json();
        }) //or(response=> {response.json();})
        .then(data => {
            countriesContainer.innerHTML='';
            renderCountries(data[0]);
            const neighbour=data[0].borders[0];

            if(!neighbour) return;

            //country 2
            //.then() method will always return a promise but when we specify
            //the return value then it becomes the fulfilment value of promise
            return fetch(`https://restcountries.com/v2/alpha/${neighbour}`);
        })
        .then(response => response.json())
        .then(data => renderCountries(data, 'neighbour'))
        .catch(err => {
            console.log(`${err} 🙁`);
            renderError(`Something went wrong 🙁🙁 ${err.message}. Try again!`)
        })
        .finally(() => {
            countriesContainer.style.opacity=1;
        });
};

btn.addEventListener('click',()=> {
    const cname=document.querySelector('#search input').value;
    console.log(cname);
    if(cname.toLowerCase==='india') getCountryAndNeighbour('bharat');
    else getCountryAndNeighbour(cname);
});
