<template> 
  <div class="layout">
    <Layout style="height: 100vh;">
      <Sider ref="side1" hide-trigger collapsible :collapsed-width="78" v-model="isCollapsed">
        <Menu :active-name="currentRoute" theme="dark" width="auto" class="custom-menu">
          <MenuItem
            @click="goTo('/home')"
            name="/home"
            :class="{ active: currentRoute === '/home' }"
          >
            <Icon type="ios-navigate"></Icon>
            <span>Home</span>
          </MenuItem>
          <MenuItem
            @click="goTo('/product-transaction')"
            name="/product-transaction"
            :class="{ active: currentRoute === '/product-transaction' }"
          >
            <Icon type="ios-search"></Icon>
            <span>Product Transaction</span>
          </MenuItem>
          <MenuItem
            @click="goTo('/product-inventory')"
            name="/product-inventory"
            :class="{ active: currentRoute === '/product-inventory' }"
          >
            <Icon type="ios-cube"></Icon>
            <span>Product Inventory</span>
          </MenuItem>
          <MenuItem
            @click="goTo('/about')"
            name="/about"
            :class="{ active: currentRoute === '/about' }"
          >
            <Icon type="ios-settings"></Icon>
            <span>About</span>
          </MenuItem>
        </Menu>
      </Sider>
      <Layout>
        <Header :style="{padding: 0}" class="layout-header-bar">
          <Icon
            @click="collapsedSider"
            :class="rotateIcon"
            :style="{margin: '0 20px'}"
            type="md-menu"
            size="24"
          ></Icon>
          <b>The Beauty Shelf</b>
        </Header>
        <Content :style="{margin: '20px', background: '#fff', minHeight: '260px', overflowY: 'auto'}">
          <RouterView></RouterView>
        </Content>
      </Layout>
    </Layout>
  </div>
</template>
<style scoped>
.custom-menu {
  padding-top: 20px;
}

/* Base menu item styling */
.custom-menu >>> .ivu-menu-item {
  display: flex;
  align-items: center;
  padding: 12px 24px !important;
  border-radius: 8px;
  transition: background-color 0.3s ease, color 0.3s ease;
  color: #bfa18a; /* soft nude/taupe */
  cursor: pointer;
}

/* Hover effect */
.custom-menu >>> .ivu-menu-item:hover {
  background-color: #e8dcd4; /* soft warm nude background */
  color: #4a4039; /* dark muted brown */
}

.custom-menu >>> .ivu-menu-item:hover i {
  color: #4a4039 !important;
}

/* Active item styling */
.custom-menu >>> .ivu-menu-item.active {
  background-color: #d8c1b3 !important; /* deeper nude */
  color: white !important;
  font-weight: 600;
}

/* Icon color inside menu item */
.custom-menu >>> .ivu-menu-item i {
  font-size: 20px;
  color: #bfa18a; /* nude/taupe */
  margin-right: 12px;
  transition: color 0.3s ease;
}

/* Text next to icons */
.custom-menu >>> .ivu-menu-item span {
  font-size: 16px;
  font-weight: 500;
}

/* Icon when active */
.custom-menu >>> .ivu-menu-item.active i {
  color: white !important;
}

/* Brighter header styles */
.layout-header-bar {
  background-color: #f5f1ed;  /* elegant light nude */
  color: #4a4039;             /* soft dark brown */
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  font-weight: bold;
  display: flex;
  align-items: center;
}

.layout-header-bar i {
  color: #4a4039;
  cursor: pointer;
  transition: color 0.3s ease;
}

.layout-header-bar i:hover {
  color: #a67c6d; /* dusty rose hover */
}
</style>


<script>
    export default {
        data () {
            return {
                isCollapsed: false
            }
        },
        computed: {
            rotateIcon () {
                return [
                    'menu-icon',
                    this.isCollapsed ? 'rotate-icon' : ''
                ];
            },
            menuitemClasses () {
                return [
                    'menu-item',
                    this.isCollapsed ? 'collapsed-menu' : ''
                ]
            },

            currentRoute() {
                return this.$route.path
            }
        },
        methods: {
            collapsedSider () {
                this.$refs.side1.toggleCollapse();
            },
            goTo(path) {
                this.$router.push(path);
            }
        }
    }
</script>
