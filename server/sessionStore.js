const sessions = {};

//Created by Isaac Philo on April 18th, 2025
//Extract the session token from among the cookies of the request's header
  // console.log("Attempting to extract session token from cookies = " + request);
  //NOTE: Since regular cookies are not sent between websites unless some very specific form of authentication is used, I am using a custom header property instead called myCookies
  // console.log("Properties of request headers: " + Object.getOwnPropertyNames(request.headers));
function getSessionToken(request) {
  let cookiesUnSplit = request.headers.mycookies;
  let cookies = cookiesUnSplit ? cookiesUnSplit.split(";") : [];
  let sessionToken = null;
  for (let i = 0; i < cookies.length; i++) {
    if (cookies[i].split('=')[0].trim() === 'session') {
      sessionToken = cookies[i].split('=')[1];
    }
  }
  return sessionToken;
}

module.exports = { sessions, getSessionToken };