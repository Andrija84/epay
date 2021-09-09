<template>
  <div id="app">


     <header>
       <h2>Simple weather</h2>
       <input type="text" v-model="searchCity">

       <select v-if="searchCity.length > 0" class="" name="" v-model="cityLatLonSearch">
          <option loading="lazy" v-for="filterSearchCity in filterSearchCities" :key="filterSearchCity.city_id" :value="filterSearchCity.lat +','+filterSearchCity.lon">
            {{ filterSearchCity.city_name }}
          </option>
      </select>
      
     </header>

     <div class="content">
        <div class="content-inner">

        <ul>
          <li v-for="city in citiesPreDef" :key="city.city_id" :id="city.city_id" @click="changeCity(city.lat, city.lon)">{{city.city_name}}</li>
        </ul>


        <h2>NEXT HOURS</h2>
        <div v-if="cityDataNextHours">
            <ul class="forecast-list">
            <li v-for="(city, index) in cityDataNextHours.hourly" :key="index"> 
              <span class="temp" v-if="index < 8">{{city.temp | tempFormat}}°</span>
              <span class="pop" v-if="index < 8">{{city.pop}}</span>
              <span class="time" v-if="index < 8">{{city.dt | dateFormat}}</span>
              <span class="icon" v-if="index < 8"><img :src="`https://openweathermap.org/img/wn/${city.weather[0].icon}.png`" alt=""></span>
            </li>
          </ul>
        </div>


        <h2>NEXT 5 DAYS</h2>    
        <div v-if="cityDataFiveDays">
          
          <!--  <div v-for="day in cityDataFiveDays.list" :key="day.dt" :id="day.dt">
              {{day.dt_txt}}
              {{day.weather[0].description}}
              <img :src="`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`" alt="">
            </div>
            --> 

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
      cityLatLon:[-22.90278,-43.2075], // Default city id on init
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
    changeCity: function (lat, lon) {
      //console.log(id);
      this.cityLatLon = [];
      this.cityLatLon.push(lat,lon);
    },
    //https://openweathermap.org/api/one-call-api
    initCityDataNextHours(){
      axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${this.cityLatLon[0]}&lon=${this.cityLatLon[1]}&exclude=current,daily,minutely,alerts&appid=1f89da47fe4d0be6bbbf376af70bdb58&units=metric`)  
        .then((response) => {
          //console.log(response.data);
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
      axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${this.cityLatLon[0]}&lon=${this.cityLatLon[1]}&exclude=current,hourly,minutely,alerts&appid=1f89da47fe4d0be6bbbf376af70bdb58&units=metric` )  
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
     
      if(val.length > 3){

         axios.get('./cities_20000.json')        
          .then((response) => {
              //console.log(response.data);
              this.citiesData = response.data;
              //this.invoicesLoaded = true;
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
    dateFormat: function (val) {
      if (!val) return ''
       val =  moment.unix(val).format("hh A");
       return val.replace(/^0(?:0:0?)?/, '');


    },
    tempFormat: function(val){
       val = val.toString();
       return val.slice(0,2);
    }
  }
}
</script>

<style>


html, body{
  background-color:#0090ff;
  width:100vw;
  height:100vh;
  margin:0;
  padding:0;
  overflow:hidden;

}
header{
  
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
ul{
  list-style-type: none;
}
ul.forecast-list{overflow-x: scroll;display:flex; }
ul.forecast-list li{  display: grid;}
.content{
  width:100%;
  height:100%;  
  display: flex;
  align-items: center;
  justify-content: center;
  }
  .content-inner{
    width:600px;
  }



</style>

