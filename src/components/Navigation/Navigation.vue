<template>
    <div class="menu-item">
        <transition enter-active-class="animated fadeIn">
            <ul>
                <li>
                    <router-link class="router-active" to="/notice">
                        <i class="fa fa-bullhorn"></i>公告详情
                    </router-link>
                </li>
                <li>
                    <router-link class="router-active" to="/quality">
                        <i class="fa fa-shield"></i>环境质量
                    </router-link>
                </li>
                <li>
                    <router-link class="router-active" to="/facilities">
                        <i class="fa fa-road"></i>环保设施
                    </router-link>
                </li>
                <li>
                    <router-link class="router-active" to="/statistics">
                        <i class="fa fa-bar-chart"></i>环保统计
                    </router-link>
                </li>
            </ul>
        </transition>
    </div>
</template>