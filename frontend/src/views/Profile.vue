<template>
  <div class="container">
    <div class="row align-items-center profile-header">
      <div class="col-md-2 mb-3">
        <img
          :src="$auth.user.picture"
          alt="User's profile picture"
          class="rounded-circle img-fluid profile-picture"
        />
      </div>
      <div class="col-md text-center text-md-left">
        <h2>{{ $auth.user.name }}</h2>
        <p class="lead text-muted">{{ $auth.user.email }}</p>
      </div>

      <div>
        <button @click="getToken">GetToken</button>
        <p>{{ tokenMessage }} </p>
      </div>
    </div>

    <div class="row">
      <highlightjs autodetect :code="JSON.stringify($auth.user, null, 2)" class="rounded w-100" />
    </div>
  </div>
</template>

<script>
export default {
  name: "getToken",
  data(){
    return {
    tokenMessage: "",
    }
  },
  methods: {
    async getToken(){
      const idToken = await this.$auth.getIdTokenClaims();
      console.log(idToken);
      const idTokenRaw = idToken.__raw;
      console.log(idTokenRaw);

      this.tokenMessage = idTokenRaw
    }
  }
}
</script>