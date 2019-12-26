<template>
    <div id="statistics">
        <div class="statistics-title">环保统计</div>
        <div class="statistics-content">
            <div class="s-score">
                <p>环保评分排名</p>
                <el-table :data="list" style="width: 100%">
                    <el-table-column type="index" label="排名" width="50"></el-table-column>
                    <el-table-column prop="name" label="公司名称" width="300"></el-table-column>
                    <el-table-column prop="score" label="评分" width="50"></el-table-column>
                </el-table>
            </div>
            <div class="s-right">
                <ul>
                    <li>
                        <p>COD排放量排名</p>
                        <el-table :data="COD" style="width: 100%">
                            <el-table-column type="index" label="排名" width="200"></el-table-column>
                            <el-table-column prop="name" label="公司名称" width="300"></el-table-column>
                            <el-table-column prop="score" label="评分"></el-table-column>
                        </el-table>
                    </li>
                    <li>
                        <p>TP排放量排名</p>
                        <el-table :data="TP" style="width: 100%">
                            <el-table-column type="index" label="排名" width="200"></el-table-column>
                            <el-table-column prop="name" label="公司名称" width="300"></el-table-column>
                            <el-table-column prop="score" label="评分"></el-table-column>
                        </el-table>
                    </li>
                    <li>
                        <p>二氧化硫排放量排名</p>
                        <el-table :data="SO2" style="width: 100%">
                            <el-table-column type="index" label="排名" width="200"></el-table-column>
                            <el-table-column prop="name" label="公司名称" width="300"></el-table-column>
                            <el-table-column prop="score" label="评分"></el-table-column>
                        </el-table>
                    </li>
                    <li>
                        <p>颗粒物排放量排名</p>
                        <el-table :data="PM" style="width: 100%">
                            <el-table-column type="index" label="排名" width="200"></el-table-column>
                            <el-table-column prop="name" label="公司名称" width="300"></el-table-column>
                            <el-table-column prop="score" label="评分"></el-table-column>
                        </el-table>
                    </li>
                    <li>
                        <p>
                            NH
                            <sub>3</sub>-N排放量排名
                        </p>
                        <el-table :data="NH" style="width: 100%">
                            <el-table-column type="index" label="排名" width="200"></el-table-column>
                            <el-table-column prop="name" label="公司名称" width="300"></el-table-column>
                            <el-table-column prop="score" label="评分"></el-table-column>
                        </el-table>
                    </li>
                    <li>
                        <p>
                            NH
                            <sub>x</sub>排放量排名
                        </p>
                        <el-table :data="NH" style="width: 100%">
                            <el-table-column type="index" label="排名" width="200"></el-table-column>
                            <el-table-column prop="name" label="公司名称" width="300"></el-table-column>
                            <el-table-column prop="score" label="评分"></el-table-column>
                        </el-table>
                    </li>
                </ul>
            </div>
        </div>
        <div class="statistics-bottom">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="年度总排名" name="first">
                    <div class="sb-left">
                        <el-table :data="general" style="width: 100%">
                            <el-table-column prop="type" label="类型"></el-table-column>
                            <el-table-column prop="2015" label="2015"></el-table-column>
                            <el-table-column prop="2016" label="2016"></el-table-column>
                            <el-table-column prop="2017" label="2017"></el-table-column>
                            <el-table-column prop="2018" label="2018"></el-table-column>
                            <el-table-column prop="2019" label="2019"></el-table-column>
                        </el-table>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="年度废水指标" name="second">
                    <div class="sb-left">
                        <el-table :data="wasteWater" style="width: 100%">
                            <el-table-column prop="type" label="类型"></el-table-column>
                            <el-table-column prop="2015" label="2015"></el-table-column>
                            <el-table-column prop="2016" label="2016"></el-table-column>
                            <el-table-column prop="2017" label="2017"></el-table-column>
                            <el-table-column prop="2018" label="2018"></el-table-column>
                            <el-table-column prop="2019" label="2019"></el-table-column>
                        </el-table>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="年度废气指标" name="third">
                    <div class="sb-left">
                        <el-table :data="wasteGas" style="width: 100%">
                            <el-table-column prop="type" label="类型"></el-table-column>
                            <el-table-column prop="2015" label="2015"></el-table-column>
                            <el-table-column prop="2016" label="2016"></el-table-column>
                            <el-table-column prop="2017" label="2017"></el-table-column>
                            <el-table-column prop="2018" label="2018"></el-table-column>
                            <el-table-column prop="2019" label="2019"></el-table-column>
                        </el-table>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
import "./index.less";
import { getEnterprise } from "../../services";

export default {
    data() {
        return {
            list: [],
            COD: [],
            TP: [],
            SO2: [],
            PM: [],
            NH: [],
            activeName: "first",
            general: [
                {
                    type: "废水",
                    2015: "0t/a",
                    2016: "0t/a",
                    2017: "0t/a",
                    2018: "0t/a",
                    2019: "0t/a"
                },
                {
                    type: "一般固废",
                    2015: "0t/a",
                    2016: "0t/a",
                    2017: "0t/a",
                    2018: "0t/a",
                    2019: "0t/a"
                },
                {
                    type: "危险固废",
                    2015: "0t/a",
                    2016: "0t/a",
                    2017: "0t/a",
                    2018: "0t/a",
                    2019: "0t/a"
                }
            ],
            wasteWater: [
                {
                    type: "COD",
                    2015: "0t/a",
                    2016: "0t/a",
                    2017: "0t/a",
                    2018: "0t/a",
                    2019: "0t/a"
                },
                {
                    type: "TP",
                    2015: "0t/a",
                    2016: "0t/a",
                    2017: "0t/a",
                    2018: "0t/a",
                    2019: "0t/a"
                },
                {
                    type: "TN",
                    2015: "0t/a",
                    2016: "0t/a",
                    2017: "0t/a",
                    2018: "0t/a",
                    2019: "0t/a"
                },
                {
                    type: "NH3-N",
                    2015: "0t/a",
                    2016: "0t/a",
                    2017: "0t/a",
                    2018: "0t/a",
                    2019: "0t/a"
                },
                {
                    type: "重金属",
                    2015: "0t/a",
                    2016: "0t/a",
                    2017: "0t/a",
                    2018: "0t/a",
                    2019: "0t/a"
                }
            ],
            wasteGas: [
                {
                    type: "SO2",
                    2015: "0t/a",
                    2016: "0t/a",
                    2017: "0t/a",
                    2018: "0t/a",
                    2019: "0t/a"
                },
                {
                    type: "NO2",
                    2015: "0t/a",
                    2016: "0t/a",
                    2017: "0t/a",
                    2018: "0t/a",
                    2019: "0t/a"
                },
                {
                    type: "VOCS",
                    2015: "0t/a",
                    2016: "0t/a",
                    2017: "0t/a",
                    2018: "0t/a",
                    2019: "0t/a"
                },
                {
                    type: "颗粒物",
                    2015: "0t/a",
                    2016: "0t/a",
                    2017: "0t/a",
                    2018: "0t/a",
                    2019: "0t/a"
                }
            ]
        };
    },
    mounted() {
        let id = JSON.parse(sessionStorage.getItem("rows")).id;
        getEnterprise({
            params: {
                parkId: id
            }
        })
            .then(reps => {
                this.list = reps.data.rows.slice(0, 10);
            })
            .catch(err => {
                console.log(err);
            });
    },
    methods: {
        handleClick() {}
    }
};
</script>