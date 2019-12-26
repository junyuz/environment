<template>
    <div class="setting">
        <p class="title">地图常用设置</p>
        <ul>
            <li @click="toggleSetting('lighting')">
                <i class="fa fa-sun-o" aria-hidden="true"></i>
                {{ lighting ? '关闭光照效果': '打开光照效果' }}
            </li>
            <li @click="toggleSetting('atmosphere')">
                <i class="fa fa-cloud" aria-hidden="true"></i>
                {{ atmosphere ? '关闭大气渲染': '打开大气渲染' }}
            </li>
            <li @click="toggleSetting('fog')">
                <i class="fa fa-taxi"></i>
                {{ fog ? '关闭雾效': '打开雾效'}}
            </li>
            <li @click="toggleSetting('terrain')">
                <i class="fa fa-life-bouy"></i>
                {{ terrain ? '关闭深度检测': '打开深度检测' }}
            </li>
        </ul>
    </div>
</template>

<script>
import "./index.less";

export default {
    data() {
        return {
            atmosphere: true,
            lighting: false,
            terrain: false,
            fog: false
        };
    },
    mounted() {},
    methods: {
        
        toggleSetting(e) {
            let viewer = this.$store.state.mapObj;

            switch (e) {
                case "atmosphere":
                    this.atmosphere = !this.atmosphere;
                    if (this.atmosphere == true) {
                        viewer.scene.skyAtmosphere.show = true;
                        this.$message({
                            message: '已打开大气渲染',
                            type: 'success'
                        })
                    } else {
                        viewer.scene.skyAtmosphere.show = false;
                        this.$message({
                            message: '已关闭大气渲染',
                            type: 'warning'
                        })
                    }
                    break;
                case "lighting":
                    this.lighting = !this.lighting;
                    if (this.lighting == true) {
                        viewer.scene.globe.enableLighting = true;
                        this.$message({
                            message: '已打开光照效果',
                            type: 'success'
                        })
                    } else {
                        viewer.scene.globe.enableLighting = false;
                        this.$message({
                            message: '已关闭光照效果',
                            type: 'warning'
                        })
                    }
                    break;
                case "fog":
                    this.fog = !this.fog;
                    if (this.fog == true) {
                        viewer.scene.fog.enabled = true;
                        this.$message({
                            message: '已打开雾效',
                            type: 'success'
                        })
                    } else {
                        viewer.scene.fog.enabled = true;
                        this.$message({
                            message: '已关闭雾效',
                            type: 'warning'
                        })
                    }
                    break;
                case "terrain":
                    this.terrain = !this.terrain;
                    if (this.terrain == true) {
                        viewer.scene.globe.depthTestAgainstTerrain = true;
                        this.$message({
                            message: '已打开深度检测',
                            type: 'success'
                        })
                    } else {
                        viewer.scene.globe.depthTestAgainstTerrain = false;
                        this.$message({
                            message: '已关闭深度检测',
                            type: 'warning'
                        })
                    }
                    break;
            }
        }
    }
};
</script>