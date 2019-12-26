<template>
    <div class="camera">
        <el-card class="box-card" id="camera">
            <div slot="header" class="clearfix">
                <span>{{ camera.data.name || '暂无' }}</span>
                <el-button class="co" type="text" @click="close">关闭</el-button>
            </div>
            <div class="camera-top">
                <video src="../../assets/camera.mp4" autoplay muted loop></video>
            </div>
            <div class="camera-bottom">
                <ul>
                    <li>
                        <i class="fa fa-arrow-left c1"></i>
                    </li>
                    <li>
                        <i class="fa fa-arrow-up"></i>
                    </li>
                    <li>
                        <i class="fa fa-arrow-right c2"></i>
                    </li>
                    <br />
                    <li>
                        <i class="fa fa-arrow-left"></i>
                    </li>
                    <li>
                        <i class="fa fa-circle"></i>
                    </li>
                    <li>
                        <i class="fa fa-arrow-right"></i>
                    </li>
                    <br />
                    <li>
                        <i class="fa fa-arrow-left c3"></i>
                    </li>
                    <li>
                        <i class="fa fa-arrow-down"></i>
                    </li>
                    <li>
                        <i class="fa fa-arrow-right c4"></i>
                    </li>
                </ul>
            </div>
        </el-card>
    </div>
</template>

<script>
import "./index.less";

export default {
    props: {
        camera: {}
    },
    methods: {
        close() {
          this.$emit('close');
        }
    }
};
</script>