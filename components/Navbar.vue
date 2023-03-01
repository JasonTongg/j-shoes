<template>
  <header>
    <nav>
      <nuxtLink tag="h2" to="/">Shoes <span>Collections</span></nuxtLink>
      <ul>
        <li>Home</li>
        <li>Collections</li>
        <li>Sale</li>
        <li>
          Cart
          <img src="../static/assets/icon/cart.svg" alt="cart" />
          <p v-show="cart.length > 0"></p>
        </li>
        <nuxtLink tag="li" to="/admin" v-if="userData.userName">{{
          userData.userName
        }}</nuxtLink>
        <li v-if="userData.userName" @click="logout">Logout</li>
        <nuxtLink tag="li" to="/login" v-else>Login</nuxtLink>
      </ul>
    </nav>
    {{ cart }}
  </header>
</template>
<script>
export default {
  data() {
    return {
      cart: [],
    };
  },
  computed: {
    userData() {
      return this.$store.getters.getUserData;
    },
  },
  mounted() {
    this.$store.dispatch("getUserCart");
    this.cart = this.$store.getters.getCart;
  },
  methods: {
    logout() {
      this.$store.dispatch("userLogout");
      this.cart = [];
    },
  },
};
</script>
<style scoped>
* {
  padding: 0;
  margin: 0;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  font-family: "Lexend Deca", sans-serif;
}
header nav {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
  padding: 2rem 5rem;
  background-color: #093545;
}

header nav h2 {
  font-size: 2rem;
  color: white;
  cursor: pointer;
}

header nav h2 span {
  color: #20df7f;
}

header nav ul {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  gap: 2rem;
  list-style: none;
}

header nav ul li {
  font-size: 1.2rem;
  cursor: pointer !important;
  color: white;
  display: flex;
  align-self: center;
  justify-content: center;
  gap: 0.3rem;
  position: relative;
}

header nav ul li img {
  width: 20px;
}

header nav ul li p {
  position: absolute;
  top: 0px;
  right: 0px;
  width: 8px;
  height: 8px;
  background-color: red;
  border-radius: 50%;
}

header nav ul li:last-of-type,
header nav ul li:nth-of-type(5) {
  background-color: #224957;
  padding: 0.5rem 1rem;
  border-radius: 100px;
  color: white;
}
</style>
