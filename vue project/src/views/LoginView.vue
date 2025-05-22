<template>
  <div class="login-container">
    <div class="inventory-title">The Beauty Shelf</div>
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
  background: #f8f1ec;
  font-family: 'Source Sans Pro', sans-serif;
  color: #4a4039;
  position: relative;
  padding: 20px;
}

/* Decorative line or symbol */
.login-decor {
  width: 60px;
  height: 2px;
  background-color: #d8c1b3;
  margin: 8px auto 24px auto;
  border-radius: 2px;
}

/* Title above the card */
.inventory-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 2.2rem;
  font-weight: 600;
  color: #a67c6d;
  text-align: center;
  margin-bottom: 0;
  letter-spacing: 0.03em;
}

/* Card with soft nude box shadow */
.login-card {
  width: 380px;
  background: #fff8f3;
  padding: 32px 24px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(107, 91, 81, 0.12);
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: stretch;
}
</style>
