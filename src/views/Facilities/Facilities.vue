<template>
    <div id="facilities">
        <div class="facilities-title">环保设施</div>
        <div class="facilities-content">
            <div class="f-list">
                <p>设施列表</p>
                <ul>
                    <li
                        v-for="(item,index) in list"
                        :key="index"
                        @click="handelSelect(item)"
                    >{{ item.title || '暂无数据' }}</li>
                </ul>
            </div>
            <div class="f-content" v-if="hasContent">
                <p>{{ content.title }}</p>
                <div class="f-main">
                    <el-carousel indicator-position="none" height="270px" v-if="imgArr1.length > 0">
                        <el-carousel-item v-for="item in imgArr1" :key="item">
                            <img :src="item" />
                        </el-carousel-item>
                    </el-carousel>
                    <p>{{ content.facilityContext || '暂无数据'}}</p>
                </div>
                <div class="f-other">
                    <el-tabs v-model="activeName" @tab-click="handleClick">
                        <el-tab-pane label="工艺流程" name="first">
                            <div>
                                <el-carousel indicator-position="none" height="200px" v-if="imgArr2.length > 0">
                                    <el-carousel-item v-for="item in imgArr2" :key="item">
                                        <img :src="item" />
                                    </el-carousel-item>
                                </el-carousel>
                                <p>{{ content.gyContext || '暂无数据' }}</p>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane label="排污口" name="second">
                            <div>
                                <el-carousel indicator-position="none" height="200px" v-if="imgArr3.length > 0">
                                    <el-carousel-item v-for="item in imgArr4" :key="item">
                                        <img :src="item" />
                                    </el-carousel-item>
                                </el-carousel>
                                <p>{{ content.pwkContext || '暂无数据' }}</p>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane label="运行单位" name="third">
                            <div>
                                <el-carousel indicator-position="none" height="200px" v-if="imgArr4.length > 0">
                                    <el-carousel-item v-for="item in imgArr4" :key="item">
                                        <img :src="item" />
                                    </el-carousel-item>
                                </el-carousel>
                                <p>{{ content.unitContext || '暂无数据' }}</p>
                            </div>
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import "./index.less";
import { getFacilities } from "../../services";

export default {
    data() {
        return {
            list: [],
            content: {},
            imgArr1: [],
            imgArr2: [],
            imgArr3: [],
            imgArr4: [],
            activeName: "first",
            hasContent: false
        };
    },
    mounted() {
        let row = JSON.parse(sessionStorage.getItem("rows"));
        getFacilities({
            params: {
                parkId: row.id
            }
        })
            .then(reps => {
                this.list = reps.data.rows;
            })
            .catch(err => {
                console.log(err);
            });
    },
    methods: {
        handelSelect(e) {
            this.content = e;
            if(this.content.facilityImg != null){
                this.imgArr1 = this.content.facilityImg.split(",");
            }
            if(this.content.gyImg != null){
                this.imgArr2 = this.content.gyImg.split(",");
            }
            if(this.content.pwkImg != null){
                this.imgArr3 = this.content.pwkImg.split(",");
            }
            if(this.content.unitImg != null){
                this.imgArr4 = this.content.unitImg.split(",");
            }
            this.hasContent = true;
        },
        handleClick() {}
    }
};
</script>