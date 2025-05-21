<style scoped>
.layout {
  border: 1px solid #d7dde4;
  background: #ffe4ec; /* soft pink background */
  position: relative;
  border-radius: 4px;
  overflow: hidden;
}

.layout .ivu-menu {
  z-index: 0;
}

.layout-header-bar {
  background: #f9d6de; /* light blush pink */
  box-shadow: 0 1px 1px rgba(0,0,0,.1);
  color: #b76373; /* muted pink text */
  font-weight: bold;
  font-size: 18px;
  display: flex;
  align-items: center;
  padding-left: 20px;
  height: 48px;
}

.layout-logo-left {
  width: 90%;
  height: 30px;
  background: #5b6270;
  border-radius: 3px;
  margin: 15px auto;
}

.menu-icon {
  transition: all 0.3s;
}

.rotate-icon {
  transform: rotate(-90deg);
}

.menu-item span {
  display: inline-block;
  overflow: hidden;
  min-width: 69px;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: bottom;
  transition: width 0.2s ease 0.2s;
}

.menu-item i {
  transform: translateX(0);
  transition: font-size 0.2s ease, transform 0.2s ease;
  vertical-align: middle;
  font-size: 16px;
}

.collapsed-menu span {
  width: 0;
  transition: width 0.2s ease;
}

.collapsed-menu i {
  transform: translateX(5px);
  transition: font-size 0.2s ease 0.2s, transform 0.2s ease 0.2s;
  vertical-align: middle;
  font-size: 22px;
}
</style>

<template>
  <div class="layout">
    <Layout style="height: 100vh;">
      <Sider ref="side1" hide-trigger collapsible :collapsed-width="78" v-model="isCollapsed">
        <Menu :active-name="currentRoute" theme="dark" width="auto" :class="menuitemClasses">
          <MenuItem @click="goTo('/home')" name="/home">
            <Icon type="ios-navigate"></Icon>
            <span>Home</span>
          </MenuItem>
          <MenuItem @click="goTo('/product-transaction')" name="/product-transaction">
            <Icon type="ios-search"></Icon>
            <span>Product Transaction</span>
          </MenuItem>
          <MenuItem @click="goTo('/product-inventory')" name="/product-inventory">
            <Icon type="ios-cube"></Icon>
            <span>Product Inventory</span>
          </MenuItem>
          <MenuItem @click="goTo('/about')" name="/about">
            <Icon type="ios-settings"></Icon>
            <span>About</span>
          </MenuItem>
        </Menu>
      </Sider>
      <Layout>
        <Header class="layout-header-bar" :style="{ padding: 0 }">
          <Icon
            @click="collapsedSider"
            :class="rotateIcon"
            :style="{ margin: '0 20px', cursor: 'pointer' }"
            type="md-menu"
            size="24"
          />
          SDL BEAUTYLINE
        </Header>
        <Content :style="{ margin: '20px', background: '#fff', minHeight: '260px', overflowY: 'auto' }">
          <RouterView />
        </Content>
      </Layout>
    </Layout>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isCollapsed: false,
    }
  },
  computed: {
    rotateIcon() {
      return ['menu-icon', this.isCollapsed ? 'rotate-icon' : '']
    },
    menuitemClasses() {
      return ['menu-item', this.isCollapsed ? 'collapsed-menu' : '']
    },
    currentRoute() {
      return this.$route.path
    },
  },
  methods: {
    collapsedSider() {
      this.$refs.side1.toggleCollapse()
    },
    goTo(path) {
      this.$router.push(path)
    },
  },
}
</script>
