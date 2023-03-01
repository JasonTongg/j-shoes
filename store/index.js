import axios from "axios";
import Cookie from "js-cookie";

export const state = () => ({
  shoes: [],
  token: "",
  userData: {},
  cart: [],
});

export const getters = {
  getShoes(state) {
    return state.shoes;
  },
  getUserData(state) {
    return state.userData;
  },
  getCart(state) {
    return state.cart;
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
  addToCart(state, payload) {
    return state.cart.push(payload);
  },
  setToCart(state, payload) {
    console.log(payload);
    state.cart = payload;
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
  addUserCart({ state, commit }, shoe) {
    return axios
      .post(
        `https://j-shoe-default-rtdb.firebaseio.com/accountCart${
          JSON.parse(localStorage.getItem("user")).userId
        }.json?auth=` + localStorage.getItem("token"),
        {
          ...shoe,
        }
      )
      .then((response) => {
        commit("addToCart", {
          ...shoe,
        });
      });
  },
  getUserCart({ state, commit }) {
    return axios
      .get(
        `https://j-shoe-default-rtdb.firebaseio.com/accountCart${state.userData.userId}.json?auth=` +
          localStorage.getItem("token")
      )
      .then((response) => {
        if (response.data) {
          const cartArray = [];
          for (const key in response.data) {
            cartArray.push({ ...response.data[key] });
          }
          commit("setToCart", cartArray);
        } else {
          commit("setToCart", []);
        }
      });
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
        } else {
          localStorage.setItem("userId", response.data.localId);
        }
      })
      .catch((error) => console.log(error.response.data.message));
  },
  userLogout({ commit }) {
    commit("setUserData", {});
  },
};
