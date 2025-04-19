// Created by Sarah Jacob, used for Testing (will probably delete)

const axios = require("axios");
const apiKey = process.env.GOOGLE_MAPS_API_KEY
const location = "32.9483,-96.7299"; // Richardson, TX
const radius = 5000; // meters (~3.1 miles)
const keyword = "restaurant";
const maxResults = 100;

let allResults = [];

async function fetchPage(pageToken = null) {
    const baseUrl = "https://maps.googleapis.com/maps/api/place/nearbysearch/json";
    const params = new URLSearchParams({
      key: apiKey,
      location,
      radius,
      keyword,
    });
  
    if (pageToken) {
      params.append("pagetoken", pageToken);
    }
  
    const url = `${baseUrl}?${params.toString()}`;
  
    try {
      const response = await axios.get(url);
      const { results, next_page_token } = response.data;
      console.log("Raw Google API response:", response.data);
  
      allResults.push(...results);
  
      if (next_page_token && allResults.length < maxResults) {
        console.log("WAITING for next page...");
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait for token to activate
        return fetchPage(next_page_token);
      }
    } catch (error) {
      console.error("ERROR fetching places:", error.response?.data || error.message);
    }
  }

  (async () => {
    console.log("📍 Fetching restaurants near Richardson...");
    await fetchPage();
  
    console.log(`Fetched ${allResults.length} places:\n`);
  
    allResults.slice(0, maxResults).forEach((place, index) => {
      const { name, place_id, types, geometry } = place;
      console.log(`${index + 1}. ${name}`);
      console.log(`   place_id: ${place_id}`);
      console.log(`   types: ${JSON.stringify(types)}`);
      console.log(`   location: ${geometry.location.lat}, ${geometry.location.lng}\n`);
    });
  })();