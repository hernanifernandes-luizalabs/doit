// a library to wrap and simplify api calls
import apisauce from 'apisauce'
import Config from 'react-native-config'

// the OR operation is done due to testing purposes
const BASE_URL = Config.API_URL || 'http://localhost:4000/'
const API_KEY = Config.API_KEY || ''

// our "constructor"
const create = (baseURL = BASE_URL) => {
  // ------
  // STEP 1
  // ------
  //
  // Create and configure an apisauce-based api object.
  //
  const api = apisauce.create({
    // base URL is read from the "constructor"
    baseURL,
    // here are some default headers
    headers: {
      'Cache-Control': 'no-cache'
    },
    // 10 second timeout...
    timeout: 10000
  })

  // ------
  // STEP 2
  // ------
  //
  // Define some functions that call the api.  The goal is to provide
  // a thin wrapper of the api layer providing nicer feeling functions
  // rather than "get", "post" and friends.
  //
  // I generally don't like wrapping the output at this level because
  // sometimes specific actions need to be take on `403` or `401`, etc.
  //
  // Since we can't hide from that, we embrace it by getting out of the
  // way at this level.
  //
  const getListsOfTasks = token => api.get(`users/@me/lists/?key=${API_KEY}&access_token=${token}`)
  const getTasksOfList = (listId, token) => api.get(`lists/${listId}/tasks/?key=${API_KEY}&access_token=${token}`)
  const updateTask = (listId, taskId, data, token) => api.patch(`lists/${listId}/tasks/${taskId}/?key=${API_KEY}&access_token=${token}`, data)
  const createList = (data, token) => api.post(`/users/@me/lists/?key=${API_KEY}&access_token=${token}`, data)
  const createTask = (listId, data, token) => api.post(`/lists/${listId}/tasks/?key=${API_KEY}&access_token=${token}`, data)

  // ------
  // STEP 3
  // ------
  //
  // Return back a collection of functions that we would consider our
  // interface.  Most of the time it'll be just the list of all the
  // methods in step 2.
  //
  // Notice we're not returning back the `api` created in step 1?  That's
  // because it is scoped privately.  This is one way to create truly
  // private scoped goodies in JavaScript.
  //
  return {
    // a list of the API functions from step 2
    getListsOfTasks,
    getTasksOfList,
    updateTask,
    createList,
    createTask
  }
}

// let's return back our create method as the default.
export default {
  create
}
