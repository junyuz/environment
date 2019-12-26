<template>
    <div id="notice">
        <div class="notice-title">园区公告</div>
        <div class="notice-content">
            <el-tabs tab-position="top" style="height: 200px;">
                <el-tab-pane label="园区通知">
                    <el-table
                        :data="advise.slice((currentPage-1) * pagesize, currentPage * pagesize)"
                        style="width: 100%"
                    >
                        <el-table-column prop="title" label="标题" sortable></el-table-column>
                        <el-table-column prop="params.typeName" label="类型"></el-table-column>
                        <el-table-column prop="date" label="时间" sortable></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-dialog
                                    :title="row.title"
                                    :visible.sync="dialogVisible"
                                    width="50%"
                                    :before-close="handleClose"
                                    :center="true"
                                >
                                    <div class="row-content">{{ row.content }}</div>
                                </el-dialog>
                                <el-button type="primary" @click="handleSelect(scope.row)">查看详情</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="pagination">
                        <el-pagination
                            layout="prev, pager, next"
                            background
                            :total="advise.length"
                            :page-size="pagesize"
                            @current-change="currentChange"
                        ></el-pagination>
                    </div>
                </el-tab-pane>

                <el-tab-pane label="企业公告">
                    <el-table
                        :data="notice.slice((currentPage-1) * pagesize, currentPage * pagesize)"
                        style="width: 100%"
                    >
                        <el-table-column prop="title" label="标题" sortable></el-table-column>
                        <el-table-column prop="params.typeName" label="类型"></el-table-column>
                        <el-table-column prop="date" label="时间" sortable></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-dialog
                                    :title="row.title"
                                    :visible.sync="dialogVisible"
                                    width="50%"
                                    :before-close="handleClose"
                                    :center="true"
                                >
                                    <div class="row-content">{{ row.content }}</div>
                                </el-dialog>
                                <el-button type="primary" @click="handleSelect(scope.row)">查看详情</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="pagination">
                        <el-pagination
                            layout="prev, pager, next"
                            background
                            :total="notice.length"
                            :page-size="pagesize"
                            @current-change="currentChange"
                        ></el-pagination>
                    </div>
                </el-tab-pane>

                <el-tab-pane label="法律法规">
                    <el-table
                        :data="laws.slice((currentPage-1) * pagesize, currentPage * pagesize)"
                        style="width: 100%"
                    >
                        <el-table-column prop="title" label="标题" sortable></el-table-column>
                        <el-table-column prop="params.typeName" label="类型"></el-table-column>
                        <el-table-column prop="date" label="时间" sortable></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-dialog
                                    :title="row.title"
                                    :visible.sync="dialogVisible"
                                    width="50%"
                                    :before-close="handleClose"
                                    :center="true"
                                >
                                    <div class="row-content">{{ row.content }}</div>
                                </el-dialog>
                                <el-button type="primary" @click="handleSelect(scope.row)">查看详情</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="pagination">
                        <el-pagination
                            layout="prev, pager, next"
                            background
                            :total="laws.length"
                            :page-size="pagesize"
                            @current-change="currentChange"
                        ></el-pagination>
                    </div>
                </el-tab-pane>

                <el-tab-pane label="环保政策">
                    <el-table
                        :data="policy.slice((currentPage-1) * pagesize, currentPage * pagesize)"
                        style="width: 100%"
                    >
                        <el-table-column prop="title" label="标题" sortable></el-table-column>
                        <el-table-column prop="params.typeName" label="类型"></el-table-column>
                        <el-table-column prop="date" label="时间" sortable></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-dialog
                                    :title="row.title"
                                    :visible.sync="dialogVisible"
                                    width="50%"
                                    :before-close="handleClose"
                                    :center="true"
                                >
                                    <div class="row-content">{{ row.content }}</div>
                                </el-dialog>
                                <el-button type="primary" @click="handleSelect(scope.row)">查看详情</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="pagination">
                        <el-pagination
                            layout="prev, pager, next"
                            background
                            :total="policy.length"
                            :page-size="pagesize"
                            @current-change="currentChange"
                        ></el-pagination>
                    </div>
                </el-tab-pane>

                <el-tab-pane label="行业政策">
                    <el-table
                        :data="industry.slice((currentPage-1) * pagesize, currentPage * pagesize)"
                        style="width: 100%"
                    >
                        <el-table-column prop="title" label="标题" sortable></el-table-column>
                        <el-table-column prop="params.typeName" label="类型"></el-table-column>
                        <el-table-column prop="date" label="时间" sortable></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-dialog
                                    :title="row.title"
                                    :visible="dialogVisible"
                                    width="50%"
                                    :before-close="handleClose"
                                    :center="true"
                                    :modal="false"
                                    :append-to-body="true"
                                    :close-on-click-modal="false"
                                    :destroy-on-close="true"
                                >
                                    <div class="row-content">{{ row.content }}</div>
                                </el-dialog>
                                <el-button type="primary" @click="handleSelect(scope.row)">查看详情</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="pagination">
                        <el-pagination
                            layout="prev, pager, next"
                            background
                            :total="industry.length"
                            :page-size="pagesize"
                            @current-change="currentChange"
                        ></el-pagination>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
import "./index.less";
import { getNotice } from "../../services";

export default {
    data() {
        return {
            advise: [],
            notice: [],
            laws: [],
            policy: [],
            industry: [],
            currentPage: 1,
            pagesize: 12,
            row: {},
            dialogVisible: false
        };
    },
    mounted() {
        let rows = JSON.parse(sessionStorage.getItem("rows"));
        getNotice({
            params: {
                parkId: rows.id
            }
        }).then(reps => {
            let list = reps.data.rows;
            for (let i = 0; i < list.length; i++) {
                let type = list[i].params.typeName;
                switch (type) {
                    case "园区通知":
                        this.advise.push(list[i]);
                        break;
                    case "企业公告":
                        this.notice.push(list[i]);
                        break;
                    case "法律法规":
                        this.laws.push(list[i]);
                        break;
                    case "环保政策":
                        this.policy.push(list[i]);
                        break;
                    case "行业政策":
                        this.industry.push(list[i]);
                        break;
                }
            }
        });
    },
    methods: {
        currentChange(currentPage) {
            this.currentPage = currentPage;
        },
        handleSelect(e) {
            this.row = e;
            this.dialogVisible = true;
        },
        handleClose() {
            this.dialogVisible = false;
        }
    }
};
</script>