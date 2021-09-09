<template>
   <div id="app">
      <header>
         <div class="container">
            <div class="title">Simple weather</div>
            <div class="search-input-container">
               <input class="search-input" type="text" v-model="searchCity">
               <select id="search-results" class="search-select" v-if="searchCity.length > 0" v-model="cityLatLonSearch">
                  <option @click="closeSelect()" v-for="filterSearchCity in filterSearchCities" :key="filterSearchCity.city_id" :value="filterSearchCity.lat +','+filterSearchCity.lon + ',' + filterSearchCity.city_name">
                     {{ filterSearchCity.city_name }}
                  </option>
               </select>
            </div>
         </div>
      </header>
      <div class="city-tabs">
         <div class="container">
            <div class="tab-item" 
               v-for="(city, i) in citiesPreDef" 
               :key="city.city_id" 
               :id="city.city_id"
               :class="{ active: i === activeItem }" 
               @click="changeCityTab(city.lat, city.lon, city.city_name, i)">
               {{city.city_name}}
            </div>
         </div>
      </div>
      <div class="container">
         <h1>{{cityLatLon[2]}}</h1>
         <hr>
         <div class="next-hours-container">
            <h2>Next hours</h2>
            <hr>
            <div v-if="cityDataNextHours">
               <div class="forecast-list-next-hour">
                  <div class="forecast-list-next-hour-item" v-for="i in 4" :key="i"> 
                     <span class="temp">{{cityDataNextHours.hourly[i].temp | tempFormat}}°</span>
                     <span class="pop">{{cityDataNextHours.hourly[i].pop}}</span>
                     <span class="icon"><img :src="`https://openweathermap.org/img/wn/${cityDataNextHours.hourly[i].weather[0].icon}.png`" alt=""></span>
                     <span class="time">{{cityDataNextHours.hourly[i].dt | dateFormatHours}}</span>
                  </div>
               </div>
            </div>
         </div>
         <div class="next-days-container">
            <h2>Next 5 days</h2>
            <hr>
            <div v-if="cityDataFiveDays">
               <div class="forecast-list-next-days">
                  <div class="forecast-list-next-days-item" v-for="i in 4" :key="i">
                     <div>
                        <span class="icon"><img :src="`https://openweathermap.org/img/wn/${cityDataFiveDays.daily[i].weather[0].icon}.png`" alt=""></span>
                     </div>
                     <div class="description">
                        <span class="time">{{cityDataFiveDays.daily[i].dt | dateFormatDays}}</span>
                        <span class="pop">{{cityDataFiveDays.daily[i].weather[0].description}}</span>
                     </div>
                     <div class="temp-min-max">
                        <span class="temp">{{cityDataFiveDays.daily[i].temp.min | tempFormat}}° </span>
                        <span class="temp">{{cityDataFiveDays.daily[i].temp.max | tempFormat}}° </span>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   </div>
</template>
<script>
   import axios from 'axios';
   import moment from 'moment';
   //import citiesJson from "./cities_20000.json";
   
   export default {
     name: 'App',
     components: {
       
     },
   
     
     data(){
       return{
         activeItem: null,
         cityLatLon:[-22.90278,-43.2075, "Rio de Janeiro"], // Default city id on init
         cityLatLonSearch: '',
         citiesPreDef:[
            {"city_id":3451190,"city_name":"Rio de Janeiro","state_code":"21","country_code":"BR","country_full":"Brazil","lat":-22.90278,"lon":-43.2075}, 
            {"city_id":1816670,"city_name":"Beijing","state_code":"22","country_code":"CN","country_full":"Paracel Islands","lat":39.9075,"lon":116.39723}, 
            {"city_id":5344994,"city_name":"East Los Angeles","state_code":"CA","country_code":"US","country_full":"United States","lat":34.0239,"lon":-118.17202}
         ], 
         searchCity: '',
         citiesData: [],
         cityDataNextHours: null,
         cityDataFiveDays: null   
       }
     },
   
     methods:{
       closeSelect(){
         document.getElementById("search-results").size="0";
       },
       changeCityTab: function (lat, lon, city_name,i) {
         //console.log(id);
         this.activeItem = i;
         this.cityLatLon = [];
         this.cityLatLon.push(lat,lon,city_name);
       },
       //https://openweathermap.org/api/one-call-api
       initCityDataNextHours(){
         axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${this.cityLatLon[0]}&lon=${this.cityLatLon[1]}&exclude=current,daily,minutely,alerts&appid=1f89da47fe4d0be6bbbf376af70bdb58&units=metric&cnt=4`)  
           .then((response) => {
             console.log(response.data);
             this.cityDataNextHours = response.data;
             //this.invoicesLoaded = true;
           })
           .catch((errors) => {
             // console.log(error.data.errors);
             if(errors){
               console.log('something wrong with loading places')
             }
           // Remove console log HTTP status code errors    
           // console.clear();  
         });
       },
        initCityDataFiveDays(){
         axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${this.cityLatLon[0]}&lon=${this.cityLatLon[1]}&exclude=current,hourly,minutely,alerts&appid=1f89da47fe4d0be6bbbf376af70bdb58&units=metric&cnt=4` )  
           .then((response) => {
             //console.log(response.data);
             this.cityDataFiveDays = response.data;
             //this.invoicesLoaded = true;
           })
           .catch((errors) => {
             // console.log(error.data.errors);
             if(errors){
               console.log('something wrong with loading places')
             }
           // Remove console log HTTP status code errors    
           // console.clear();  
         });
       },
     },
     created(){
       this.initCityDataFiveDays();
       this.initCityDataNextHours();
     },
     mounted(){
       //console.log(this.cityLatLon);
       //this.initCityData();
       //console.log(this.cityData);
       //this.getCitiesJson();
     },
     computed: {
       filterSearchCities() {
         return this.citiesData.filter( cityData => {
           return !this.searchCity ||
             cityData.city_name.toLowerCase().indexOf(this.searchCity.toLowerCase()) > -1
         })
       }
     },
     watch: {
       // whenever question changes, this function will run
       cityLatLonSearch: function(val) {
         //console.log(val);
         let valArr = val.split(',')
         //console.log(valArr);
         this.cityLatLon = [];
         this.cityLatLon = valArr;
         this.initCityDataFiveDays();
         this.initCityDataNextHours();
       },
       cityLatLon: function(val) { 
         this.initCityDataFiveDays();
         this.initCityDataNextHours();
       },
       searchCity: function(val){
        
         if(val.length > 2){
   
            axios.get('./cities_20000.json')        
             .then((response) => {
                 //console.log(response.data);
                 this.citiesData = response.data;
                 // Auto open select box if results appears
                 if(response.data.length > 0){
                   document.getElementById("search-results").size = "10";
                 }
               })
               .catch((errors) => {
                 if(errors){
                   console.log('something wrong with loading cities')
                 }
               });
         }
         else{
           this.citiesData = [];
         }
       },
     
     },
     filters: {
       dateFormatHours: function (val) {
         if (!val) return ''
          val =  moment.unix(val).format("h A");
          return val;
       },
       dateFormatDays: function (val) {
         if (!val) return ''
          val =  moment.unix(val).format("ddd, MMM D");
          return val;
       },
       tempFormat: function(val){
          val = val.toString();
          return val.slice(0,2);
       }
     }
   }
</script>