<style scoped>
    .layout{
        border: 1px solid #d7dde4;
        background: #B76E79;
        position: relative;
        border-radius: 4px;
        overflow: hidden;
    }
    .layout .ivu-menu{
        z-index: 0
    }
    .layout-header-bar{
        background: #ADD8E6;
        box-shadow: 0 1px 1px rgba(0,0,0,.1);
    }
    .layout-logo-left{
        width: 90%;
        height: 30px;
        background: #5b6270;
        border-radius: 3px;
        margin: 15px auto;
    }
    .menu-icon{
        transition: all .3s;
    }
    .rotate-icon{
        trans: rotate(-90deg);
    }
    .menu-item span{
        display: inline-block;
        overflow: hidden;
        min-width: 69px;
        text-overflow: ellipsis;
        white-space: nowrap;
        vertical-align: bottom;
        transition: width .2s ease .2s;
    }
    .menu-item i{
        trans: translateX(0px);
        transition: font-size .2s ease, trans .2s ease;
        vertical-align: middle;
        font-size: 16px;
    }
    .collapsed-menu span{
        width: 0px;
        transition: width .2s ease;
    }
    .collapsed-menu i{
        trans: translateX(5px);
        transition: font-size .2s ease .2s, trans .2s ease .2s;
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
                    <!-- <MenuItem @click="goTo('/inventory')" name="/inventory">
                        <Icon type="ios-search"></Icon>
                        <span>Inventory</span>
                    </MenuItem> -->
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
                <Header :style="{padding: 0}" class="layout-header-bar">
                    <Icon @click="collapsedSider" :class="rotateIcon" :style="{margin: '0 20px'}" type="md-menu" size="24"></Icon>
                    <b>SDL BEAUTY LINE</b>
                </Header>
                <Content :style="{margin: '20px', background: '#fff', minHeight: '260px', overflowY: 'auto'}">
                    <RouterView></RouterView>
                </Content>
            </Layout>
        </Layout>
    </div>
</template>
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
