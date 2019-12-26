<template>
    <div class="enterprise">
        <el-card class="box-card" id="enterprise">
            <div slot="header" class="clearfix">
                <span>{{ enterprise.enterprise.name || '暂无' }}</span>
                <el-button type="text" @click="close">关闭</el-button>
            </div>
            <div class="enterprise-content">
                <el-carousel height="200px" v-if="enterprise.imgList.length > 0">
                    <el-carousel-item v-for="item in enterprise.imgList" :key="item">
                        <img :src="item" />
                    </el-carousel-item>
                </el-carousel>
                <span v-else></span>
                <p>企业简介</p>
                <div class="content-item">{{ enterprise.enterprise.content || '暂无' }}</div>
                <p>产业定位</p>
                <div>{{ enterprise.enterprise.industry || '暂无' }}</div>
                <p>企业等级</p>
                <div>一般企业</div>
                <p>等级分类</p>
                <div>
                    <ul class="content-type">
                        <li>气风险等级分类: 一般</li>
                        <li>水风险等级分类: 一般</li>
                        <li>清洁生产水平等级: 一般</li>
                    </ul>
                </div>
                <p>风险源</p>
                <div>
                    <ul class="content-type">
                        <li>地下水风险源: 无</li>
                        <li>土壤风险源: 无</li>
                    </ul>
                </div>
                <p>评分排名</p>
                <div>{{ enterprise.enterprise.score || '暂无' }}</div>
                <p>面积</p>
                <div>{{ enterprise.enterprise.area || '暂无' }}</div>
                <p>环保手续</p>
                <div>
                    <ul class="fileList" v-if="enterprise.fileList.length > 0">
                        <li
                            v-for="(item,index) in enterprise.fileList"
                            :key="index"
                            @click="openFile(item)"
                        >{{ (index+1) + '. '+ item.name }}
                        </li>
                    </ul>
                    <span v-else>暂无</span>
                </div>
                <p>联系电话</p>
                <div>{{ enterprise.enterprise.phone || '暂无' }}</div>
                <p>联系邮箱</p>
                <div>{{ enterprise.enterprise.mail || '暂无' }}</div>
                <p>地址</p>
                <div>{{ enterprise.enterprise.address || '暂无' }}</div>
            </div>
        </el-card>
    </div>
</template>

<script>
import "./index.less";

export default {
    name: "enterprise",
    props: {
        enterprise: {}
    },
    methods: {
        close() {
            this.$emit("close");
        },
        openFile(item) {
            this.$message({
                message: "即将打开文件..."
            });
            setTimeout(() => {
                window.open(item.params.file.path);
            }, 1000);
        }
    }
};
</script>