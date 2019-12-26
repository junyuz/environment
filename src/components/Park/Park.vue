<template>
    <div class="park">
        <el-card class="box-card" id="parkCard">
            <div slot="header" class="clearfix">
                <span>{{ parkData.parkData.name || '暂无' }}</span>
                <el-button type="text" @click="close">关闭</el-button>
            </div>
            <div class="park-content">
                <el-carousel height="200px" v-if="parkData.imgList.length > 0">
                    <el-carousel-item v-for="item in parkData.imgList" :key="item">
                        <img :src="item" />
                    </el-carousel-item>
                </el-carousel>
                <span v-else></span>
                <p>园区简介</p>
                <div class="content-item">{{ parkData.parkData.content || '暂无' }}</div>
                <p>所属区县</p>
                <div>{{ parkData.parkData.districtName || '暂无' }}</div>
                <p>管理单位</p>
                <div>{{ parkData.parkData.adminUnit || '暂无' }}</div>
                <p>单位性质</p>
                <div>{{ parkData.parkData.natureUnit || '暂无' }}</div>
                <p>面积</p>
                <div>{{ parkData.parkData.area || '暂无' }}</div>
                <p>产业定位</p>
                <div>{{ parkData.parkData.industry || '暂无' }}</div>
                <p>联系电话</p>
                <div>{{ parkData.parkData.phone || '暂无' }}</div>
                <p>联系邮箱</p>
                <div>{{ parkData.parkData.mail || '暂无' }}</div>
                <p>地址</p>
                <div>{{ parkData.parkData.address || '暂无' }}</div>
                <p>环保督察</p>
                <div>{{ parkData.parkData.supervision || '暂无' }}</div>
                <p>搜素建议</p>
                <div>{{ parkData.parkData.advice || '暂无' }}</div>
            </div>
        </el-card>
    </div>
</template>

<script>
import "./index.less";

export default {
    props: {
        parkData: {}
    },
    methods:{
        close(){
            this.$emit('close');
        }
    }
};
</script>