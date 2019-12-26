<template>
    <div class="home">
        <div class="nav">
            <div class="logo">
                <img src="../../assets/logo.png" />
                <span>智慧环保大数据可视化</span>
            </div>
            <div class="nav-menu">
                <Navigation v-if="isSession" />
                <div class="line">
                    <ul>
                        <li>
                            <el-input
                                placeholder="搜索地区"
                                v-model="keywords"
                                class="input-with-select"
                                @keyup.enter.native="search"
                            >
                                <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
                            </el-input>
                        </li>
                        <li>
                            <el-popover
                                placement="bottom"
                                width="400"
                                trigger="manual"
                                v-model="isOpen"
                            >
                                <Location :isOpen="isOpen" @changeIsOpen="changeIsOpen($event)" />
                                <a href="javascript:" slot="reference" @click="isOpen = !isOpen">
                                    <i
                                        :class="isOpen ?'fa fa-angle-up':'fa fa-angle-down'"
                                        aria-hidden="true"
                                    ></i>
                                    {{ isOpen ? '取消选择': ' 选择地区' }}
                                </a>
                            </el-popover>
                        </li>
                        <li>
                            <router-link to="/">
                                <i class="fa fa-home"></i>首页
                            </router-link>
                        </li>
                        <li>
                            <a href="javascript:" @click="logout()">退出登录</a>
                        </li>
                        <li>
                            <el-popover placement="bottom" trigger="click">
                                <Setting />
                                <a href="javascript:" slot="reference">
                                    <i class="fa fa-align-right"></i>
                                </a>
                            </el-popover>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="content">
            <router-view @openNav="isSession = true" />
        </div>
    </div>
</template>

<script>
import "./index.less";
import { mapMutations } from "vuex";
import { Navigation, Location, Setting } from "../../components";

export default {
    name: "home",
    data() {
        return {
            keywords: "",
            isOpen: false,
            isSession: false
        };
    },
    components: {
        Navigation,
        Location,
        Setting
    },
    mounted() {
        if (sessionStorage.getItem("rows")) {
            this.isSession = true;
        }
    },
    methods: {
        ...mapMutations(["LOGOUT"]),

        search() {
            let viewer = this.$store.state.mapObj;
            let geocoder = viewer.geocoder.viewModel;
            geocoder.searchText = this.keywords;
            geocoder._searchCommand();
        },
        changeIsOpen(isOpen) {
            this.isOpen = isOpen;
        },
        logout() {
            this.$confirm("确定退出吗?", { type: "warning" })
                .then(() => {
                    this.selectShow = false;
                    this.LOGOUT();
                    const loading = this.$loading({
                        lock: true,
                        text: "正在退出...",
                        spinner: "el-icon-loading",
                        background: "rgba(0,0,0,0.9)"
                    });
                    setTimeout(() => {
                        loading.close();
                        this.$router.replace({ path: "/login" });
                    }, 2000);
                })
                .catch(error => {
                    console.log(error);
                });
        }
    }
};
</script>
