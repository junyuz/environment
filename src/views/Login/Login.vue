<template>
    <div class="login">
        <div class="logo">
            <img src="../../assets/logo.png" alt="图片加载失败" />
            智慧环保大数据可视化
        </div>
        <el-form ref="ruleForm" :model="ruleForm" status-icon :rules="rules" label-position="left">
            <el-form-item>
                <p>登录/login</p>
            </el-form-item>
            <el-form-item prop="username" label="用户名">
                <el-input
                    id="username"
                    v-model="ruleForm.username"
                    placeholder="请输入用户名"
                    maxlength="20"
                >
                    <i slot="prefix" class="el-icon-user"></i>
                </el-input>
            </el-form-item>
            <el-form-item prop="password" label="密码">
                <el-input
                    id="password"
                    type="password"
                    v-model="ruleForm.password"
                    @keyup.enter.native="login('ruleForm')"
                    placeholder="请输入密码"
                    show-password
                >
                    <i slot="prefix" class="el-icon-unlock"></i>
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="reset('ruleForm')">重置</el-button>
                <el-button type="primary" @click="toLogin('ruleForm')">登录</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import "./index.less";
import { toLogin } from "../../services";
import { mapMutations } from "vuex";

export default {
    data() {
        let validateUsername = (rule, value, callback) => {
            if (value === "") {
                callback(new Error("用户名不能为空"));
            } else {
                callback();
            }
        };
        let validatePassword = (rule, value, callback) => {
            if (value === "") {
                callback(new Error("密码不能为空"));
            } else {
                callback();
            }
        };
        return {
            ruleForm: {
                username: "admin",
                password: "admin123"
            },
            rules: {
                username: [{ validator: validateUsername, trigger: "blur" }],
                password: [{ validator: validatePassword, trigger: "blur" }]
            }
        };
    },
    methods: {
        ...mapMutations(["LOGIN"]),

        toLogin(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    const loading = this.$loading({
                        lock: true,
                        text: "正在登录...",
                        spinner: "el-icon-loading",
                        background: "rgba(0,0,0,0.9)"
                    });
                    toLogin({
                        username: this.ruleForm.username,
                        password: this.ruleForm.password
                    })
                        .then(reps => {
                            setTimeout(() => {
                                loading.close();
                                if (reps.data.code === 0) {
                                    this.LOGIN(this.ruleForm);
                                    sessionStorage.setItem(
                                        "user",
                                        JSON.stringify(this.ruleForm)
                                    );
                                    this.$router.push({ path: "/" });
                                } else {
                                    this.$message({
                                        type: "error",
                                        message: reps.data.msg
                                    });
                                }
                            }, 1500);
                        })
                        .catch(err => {
                            setTimeout(() => {
                                loading.close();
                                console.log(err);
                            }, 1500);
                        });
                } else {
                    console.log("error");
                }
            });
        },
        reset(formName) {
            this.$refs[formName].resetFields();
        }
    }
};
</script>