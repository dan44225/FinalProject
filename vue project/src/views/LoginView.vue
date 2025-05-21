<template>
  <div class="login-container">
    <div class="inventory-title">✨ BeautyLine Inventory System ✨</div>
    <Card class="login-card" shadow>
      <template #title>Login</template>
      <Form ref="loginFormRef" :model="loginForm" :rules="rules" label-position="top">
        <FormItem label="Username" prop="username">
          <Input v-model="loginForm.username" placeholder="Enter your username" />
        </FormItem>

        <FormItem label="Password" prop="password">
          <Input
            v-model="loginForm.password"
            type="password"
            placeholder="Enter your password"
            @on-enter="handleLogin"
          />
        </FormItem>

        <FormItem>
          <Button type="primary" long @click="handleLogin" :loading="loading">Login</Button>
        </FormItem>
      </Form>
    </Card>
  </div>
</template>

<script>
export default {
  name: 'LoginForm',
  data() {
    return {
      loading: false,
      loginForm: {
        username: '',
        password: '',
      },
      rules: {
        username: [{ required: true, message: 'Username is required', trigger: 'blur' }],
        password: [{ required: true, message: 'Password is required', trigger: 'blur' }],
      },
    };
  },
  methods: {
    handleLogin() {
      this.$refs.loginFormRef.validate((valid) => {
        if (valid) {
          this.loading = true;
          setTimeout(() => {
            this.loading = false;
            this.$Message.success('Login successful!');
            this.$router.push('/home');
          }, 1000);
        }
      });
    },
  },
};
</script>

<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: #ffe6f0; /* soft pink background */
}

.inventory-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #d63384;
  text-align: center;
}

.login-card {
  width: 400px;
}
</style>
