import axios from "axios";
import Cookie from "js-cookie";

export const state = () => ({
  shoes: [],
  token: "",
  userData: {},
});

export const getters = {
  getShoes(state) {
    return state.shoes;
  },
  getUserData(state) {
    return state.userData;
  },
};

export const mutations = {
  setShoes(state, payload) {
    state.shoes = payload;
  },
  deleteShoe() {
    const shoes = state.shoes.filter((item) => item.id !== payload);
    state.shoes = shoes;
  },
  setToken(state, payload) {
    state.token = payload;
  },
  setUserData(state, payload) {
    state.userData = payload;
  },
  addNewShoe(state, payload) {
    return state.shoes.push(payload);
  },
  getShoe(state, payload) {
    const shoe = state.shoes.filter((item) => item.id === payload.id);
    state.shoes[shoe.id] = payload;
  },
};

export const actions = {
  nuxtServerInit({ commit }) {
    return axios
      .get("https://j-shoe-default-rtdb.firebaseio.com/shoeList.json")
      .then((response) => {
        const shoeArray = [];
        for (const key in response.data) {
          shoeArray.push({ ...response.data[key], id: key });
        }
        commit("setShoes", shoeArray);
      })
      .catch((e) => context.error(e));
  },
  deleteShoes({ commit }, shoeId) {
    return axios
      .delete(
        "https://j-shoe-default-rtdb.firebaseio.com/shoeList/" +
          shoeId +
          ".json?auth=" +
          localStorage.getItem("token")
      )
      .then((res) => commit("deleteShoe"), shoeId);
  },
  addShoe({ commit, state }, shoe) {
    return axios
      .post(
        "https://j-shoe-default-rtdb.firebaseio.com/shoeList.json?auth=" +
          localStorage.getItem("token"),
        {
          ...shoe,
          userId: JSON.parse(localStorage.getItem("user")).userId,
        }
      )
      .then((response) => {
        commit("addNewShoe", {
          ...shoe,
          userId: state.userData.userId,
        });
      });
  },
  updateShoe({ dispatch, state }, shoe) {
    return axios
      .put(
        "https://j-shoe-default-rtdb.firebaseio.com/shoeList/" +
          shoe.id +
          ".json?auth=" +
          localStorage.getItem("token"),
        shoe.newShoe
      )
      .then((res) => dispatch("getShoe"));
  },
  authenticateUser({ commit }, authData) {
    let webAPIKey = "AIzaSyBvY_7SPJeSt-BZRr2-ST8ijbm-2erUTIA";
    let authUrl = authData.isLogin
      ? "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key="
      : "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=";

    console.log(authData);
    return axios
      .post(authUrl + webAPIKey, {
        email: authData.email,
        password: authData.password,
        displayName: authData.userName,
        returnSecureToken: true,
      })
      .then((response) => {
        commit("setToken", response.data.idToken);
        commit("setUserData", {
          userId: response.data.localId,
          email: response.data.email,
          userName: response.data.displayName,
        });
        localStorage.setItem("token", response.data.idToken);
        Cookie.set("jwt", response.data.idToken);
        if (authData.isLogin === false) {
          localStorage.setItem(
            "user",
            JSON.stringify({
              userId: response.data.localId,
              email: response.data.email,
              userName: response.data.displayName,
            })
          );
          Cookie.set(
            "acc_user",
            JSON.stringify({
              userId: response.data.localId,
              email: response.data.email,
              userName: response.data.displayName,
            })
          );
        }
      })
      .catch((error) => console.log(error.response.data.message));
  },
};
