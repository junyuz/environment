<template>
    <div class="location">
        <el-tabs v-model="activeName" type="card" tab-position="top" @tab-click="handleClick">
            <el-tab-pane label="省" name="first">
                <ul class="provinceList" v-if="provinceList.length > 0">
                    <li
                        v-for="(item, index) of provinceList"
                        :key="index.districtCode"
                        @click="getCity(item.districtCode)"
                    >{{ item.districtName }}</li>
                </ul>
                <span v-else>暂无数据</span>
            </el-tab-pane>
            <el-tab-pane label="城市" name="second">
                <ul class="cityList" v-if="cityList.length > 0">
                    <li
                        v-for="(item, index) of cityList"
                        :key="index.districtCode"
                        @click="getArea(item.districtCode)"
                    >{{ item.districtName }}</li>
                </ul>
                <span v-else>暂无数据</span>
            </el-tab-pane>
            <el-tab-pane label="区域" name="third">
                <ul class="areaList" v-if="areaList.length > 0">
                    <li
                        v-for="(item, index) of areaList"
                        :key="index.districtCode"
                        @click="getList(item.districtCode,item.districtName)"
                    >{{ item.districtName }}</li>
                </ul>
                <span v-else>暂无数据</span>
            </el-tab-pane>
        </el-tabs>
        <div class="tableList">
            <el-dialog
                :title="areaName"
                :visible="dialogVisible"
                :close-on-click-modal="false"
                :before-close="handleClose"
                :append-to-body="true"
                :destroy-on-close="true"
                :modal="false"
            >
                <el-table
                    :data="parkList.slice((currentPage-1) * pagesize, currentPage * pagesize)"
                >
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column prop="name" label="园区名称" sortable></el-table-column>
                    <el-table-column prop="address" label="园区地址"></el-table-column>
                    <el-table-column label="操作" width="100">
                        <template slot-scope="scope">
                            <el-button type="primary" size="mini" @click="handleSelect(scope.row)">
                                <i class="el-icon-position"></i>
                                定位
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="pagination">
                    <el-pagination
                        layout="total, prev, pager, next"
                        :background="true"
                        :total="total"
                        @current-change="currentChange"
                    ></el-pagination>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import "./index.less";
import { getDistrict, getPark } from "../../services";
import { getArea, template, currentTime } from '../../map/cesium-mars/mars3d';

export default {
    name: "location",
    data() {
        return {
            activeName: "first",
            provinceList: [],
            cityList: [],
            areaList: [],
            areaName: "",
            dialogVisible: false,
            parkList: [],
            total: null,
            currentPage: 1,
            pagesize: 5,
        };
    },
    mounted() {
        this.init();
    },
    props: [
        "isOpen"
    ],
    methods: {
        init() {
            this.getProvince();
        },
        getProvince() {
            getDistrict({
                params: { districtParentCode: "0" }
            })
                .then(reps => {
                    this.provinceList = this.filter(reps.data);
                })
                .catch(err => {
                    console.log(err);
                });
        },
        getCity(code) {
            getDistrict({
                params: { districtParentCode: code }
            }).then(reps => {
                this.cityList = this.filter(reps.data);
            });
            this.activeName = "second";
        },
        getArea(code) {
            getDistrict({
                params: { districtParentCode: code }
            }).then(reps => {
                this.areaList = this.filter(reps.data);
            });
            this.activeName = "third";
        },
        getList(code, name) {
            this.areaName = name;
            this.dialogVisible = true;
            this.$emit("changeIsOpen",false)
            getPark({
                params: {
                    districtCode: code
                }
            }).then(reps => {
                if (reps.status === 200) {
                    this.parkList = reps.data.rows;
                    this.total = reps.data.rows.length;
                }
            });
        },
        handleClick() {},
        filter(data) {
            let arr = [];
            for (let i = 0; i < data.length; i++) {
                let obj = {
                    districtCode: data[i].districtCode,
                    districtName: data[i].districtName
                };
                arr.push(obj);
            }
            return arr;
        },
        handleSelect(row) {
            let rows = row;
            sessionStorage.setItem('rows',JSON.stringify(rows));
            this.$store.commit('CHANGE');
            this.dialogVisible = false;
        },
        handleClose() {
            this.dialogVisible = false;
        },
        currentChange(currentPage) {
            this.currentPage = currentPage;
        }
    }
};
</script>