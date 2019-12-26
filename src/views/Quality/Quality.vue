<template>
    <div id="quality">
        <div class="quality-title">环境质量</div>
        <div class="quality-content">
            <div class="q-list">
                <p>监测点</p>
                <ul>
                    <li
                        v-for="(item,index) in list"
                        :key="index"
                        @click="handelSelect(item.id)"
                    >{{ item.name }}</li>
                </ul>
            </div>
            <div id="q-line"></div>
            <div class="q-report">
                <p>环境报告</p>
                <el-table
                    :data="report.slice((currentPage-1) * pagesize, currentPage * pagesize)"
                    style="width: 100%"
                >
                    <el-table-column prop="reportNum" label="报告编号"></el-table-column>
                    <el-table-column prop="reportName" label="报告名称" sortable></el-table-column>
                    <el-table-column prop="monitorTime" label="监测时间" sortable></el-table-column>
                    <el-table-column label="操作">
                        <el-button type="primary" @click="handleSelect(scope.row)">下载</el-button>
                    </el-table-column>
                </el-table>
                <div class="pagination">
                    <el-pagination
                        layout="prev, pager, next"
                        background
                        :total="report.length"
                        :page-size="pagesize"
                        @current-change="currentChange"
                    ></el-pagination>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import "./index.less";
import { getMonitor, getReport } from "../../services";

export default {
    data() {
        return {
            list: [],
            report: [],
            item: {},
            currentPage: 1,
            pagesize: 5
        };
    },
    mounted() {
        let id = JSON.parse(sessionStorage.getItem("rows")).id;
        getMonitor({
            params: {
                parkId: id
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
        handelSelect(id) {
            getReport({
                params: {
                    monitorId: id
                }
            })
                .then(reps => {
                    this.report = reps.data.rows;
                    if (this.report.length > 0) {
                        for (let i = 0; i < this.report.length; i++) {
                            this.item = this.report[i].dataValue.reduce(
                                (init, item) => {
                                    init.name.push(item.monitorTypeName);
                                    init.value.push(item.value);
                                    return init;
                                },
                                {
                                    name: [],
                                    value: []
                                }
                            );
                        }
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        },

        addReport(item) {
            let chart = this.$echarts.init(document.getElementById("q-line"));
            let obj = [];
            let time = new Date();
            let mouth = time.getMonth() + 1;
            let day = time.getDate();
            for (let i = 0; i < item.name.length; i++) {
                obj.push({
                    name: item.name[i],
                    type: "line",
                    stack: "总量",
                    data: [item.value[i]]
                });
            }
            let option = {
                tooltip: {
                    trigger: "axis"
                },
                legend: {
                    data: item.name,
                    textStyle: {
                        color: "aqua"
                    }
                },
                grid: {
                    left: "3%",
                    right: "3%",
                    bottom: "3%",
                    containLabel: true
                },
                xAxis: {
                    type: "category",
                    boundaryGap: false,
                    data: [mouth + "/" + day],
                    axisLine: {
                        lineStyle: {
                            color: "aqua"
                        }
                    }
                },
                yAxis: {
                    type: "value",
                    axisLine: {
                        lineStyle: {
                            color: "aqua"
                        }
                    }
                },
                series: obj
            };
            chart.setOption(option);
        },

        currentChange(currentPage) {
            this.currentPage = currentPage;
        }
    },
    watch: {
        item: function() {
            this.addReport(this.item);
        }
    }
};
</script>