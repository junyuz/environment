<template>
    <div class="gis">
        <Loading v-if="loading" />
        <div id="cesiumContainer" class="gis"></div>
        <transition enter-active-class="animated fadeIn">
            <div class="manager" v-if="openManager">
                <el-popover class="manager-popover" placement="right-start" trigger="click">
                    <div class="popover-content">
                        <p>数据管理</p>
                        <el-tree
                            empty-text="暂无数据"
                            :data="treeData"
                            :props="props"
                            show-checkbox
                            @check-change="handleCheckChange"
                        ></el-tree>
                    </div>
                    <el-button slot="reference">
                        <i class="fa fa-folder"></i>
                    </el-button>
                </el-popover>
                <el-popover class="manager-popover" placement="right" trigger="click">
                    <div class="popover-content">
                        <p>图层管理</p>
                        <ul class="popover-li">
                            <li @click="addLayer(0)">
                                谷歌影像地图
                                <i v-if="googleMap" class="fa fa-check" aria-hidden="true"></i>
                            </li>
                            <li @click="addLayer(1)">
                                arcgis 地图
                                <i v-if="arcgisMap" class="fa fa-check" aria-hidden="true"></i>
                            </li>
                        </ul>
                    </div>
                    <el-button slot="reference">
                        <i class="fa fa-map" aria-hidden="true"></i>
                    </el-button>
                </el-popover>
                <el-button @click="handleFullScreen">
                    <i :class="fullscreen ? 'fa fa-crosshairs' : 'fa fa-arrows-alt'"></i>
                </el-button>
            </div>
        </transition>

        <transition
            enter-active-class="animated fadeInUp"
            leave-active-class="animated fadeOutDown"
        >
            <div class="list" v-if="openList">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>企业列表</span>
                        <el-button
                            style="float: right; padding: 3px 0"
                            @click="openList = false"
                            type="text"
                        >关闭</el-button>
                    </div>
                    <ul>
                        <li
                            v-for="(item,index) of enterpriseList.slice((currentPage-1) * pagesize, currentPage * pagesize)"
                            :key="index"
                            class="list-item"
                            :title="item.data.name"
                            @click="handelSelect(item.data)"
                        >{{ item.data.name }}</li>
                    </ul>
                    <div class="pagination">
                        <el-pagination
                            layout="prev, pager, next"
                            background
                            small
                            :total="total"
                            :page-size="pagesize"
                            @current-change="currentChange"
                        ></el-pagination>
                    </div>
                </el-card>
            </div>
        </transition>

        <transition
            enter-active-class="animated fadeInUp"
            leave-active-class="animated fadeOutDown"
        >
            <div class="list" v-if="openMon">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>测点列表</span>
                        <el-button
                            style="float: right; padding: 3px 0"
                            @click="openMon = false"
                            type="text"
                        >关闭</el-button>
                    </div>
                    <ul>
                        <li
                            v-for="(item,index) of monitorList.slice((currentPage-1) * pagesize, currentPage * pagesize)"
                            :key="index"
                            class="list-item"
                            :title="item.name"
                            @click="handelChoose(item)"
                        >{{ item.name }}</li>
                    </ul>
                    <div class="pagination">
                        <el-pagination
                            layout="prev, pager, next"
                            background
                            small
                            :total="monitorList.length"
                            :page-size="pagesize"
                            @current-change="currentChange"
                        ></el-pagination>
                    </div>
                </el-card>
            </div>
        </transition>

        <transition
            enter-active-class="animated fadeInRight"
            leave-active-class="animated fadeOutRight"
        >
            <Park :parkData="parkData" v-if="openPark" @close="openPark = false" />
        </transition>

        <transition
            enter-active-class="animated fadeInUp"
            leave-active-class="animated fadeOutDown"
        >
            <Camera :camera="camera" v-if="openCam" @close="openCam = false" />
        </transition>

        <transition
            enter-active-class="animated fadeInRight"
            leave-active-class="animated fadeOutRight"
        >
            <Enterprise :enterprise="enterprise" v-if="openEnt" @close="openEnt = false"></Enterprise>
        </transition>
    </div>
</template>

<script>
import * as Cesium from "cesium/Cesium";
import "cesium/Widgets/widgets.css";
import "../../map/cesium-mars/mars3d.css";
import mars3d from "../../map/cesium-mars/mars3d";
import { getMapConfig } from "../../map/api";
import { createMap } from "../../map/main";
import "./index.less";
import { mapMutations } from "vuex";
import { Loading, Park, Enterprise, Camera } from "../../components";
import {
    getEnterprise,
    getFiles,
    getCamera,
    getSensor,
    getMonitor,
    getReport
} from "../../services";
import "../../index.less";

export default {
    name: "gis",
    data() {
        return {
            loading: true,
            openList: false,
            openMon: false,
            openPark: false,
            openEnt: false,
            openCam: false,
            googleMap: true,
            arcgisMap: false,
            openManager: false,
            fullscreen: false,
            viewer: {},
            parkData: {},
            parkId: "",
            treeData: [
                {
                    label: "企业分布",
                    children: [{ label: "企业" }]
                },
                {
                    label: "设备分布",
                    children: [{ label: "摄像头" }, { label: "物联网监测设备" }]
                },
                {
                    label: "环境质量现状",
                    children: [
                        { label: "大气监测点" },
                        { label: "地表水监测点" },
                        { label: "地下水监测点" },
                        { label: "土壤监测点" },
                        { label: "声监测点" }
                    ]
                },
                {
                    label: "环保管家",
                    children: [{ label: "环保管家定位" }]
                }
            ],
            props: {
                label: "label",
                children: "children"
            },
            lastEntity: null,
            enterprise: {},
            camera: {},
            enterpriseList: [],
            cameraList: [],
            sensorList: [],
            fileList: [],
            total: null,
            currentPage: 1,
            pagesize: 10,
            monitorList: [],
            airList: [],
            groundwaterList: [],
            surfaceWaterList: [],
            voiceList: [],
            soilList: [],
            airPoint: [],
            groundwaterPoint: [],
            surfaceWaterPoint: [],
            voicePoint: [],
            soilPoint: [],
            mainPark: {},
            childPark: []
        };
    },
    components: {
        Loading,
        Park,
        Enterprise,
        Camera
    },
    mounted() {
        setTimeout(() => {
            this.loading = false;
        }, 2000);
        setTimeout(() => {
            getMapConfig().then(data => {
                this.viewer = createMap("cesiumContainer", data);

                this.viewer.mars.openFlyAnimation();

                this.STORAGE(this.viewer);

                let district = this.viewer.dataSources.add(
                    Cesium.GeoJsonDataSource.load("data/district.json", {
                        stroke: Cesium.Color.WHITE,
                        fill: Cesium.Color.BLACK.withAlpha(0),
                        strokeWidth: 3
                    })
                );

                this.viewer.flyTo(district, {
                    offset: {
                        heading: Cesium.Math.toRadians(0.0),
                        pitch: Cesium.Math.toRadians(-90)
                    }
                });

                this.viewer.terrainProvider = Cesium.createWorldTerrain({
                    requestWaterMask: true,
                    requestVertexNormals: true
                });

                this.viewer.scene.globe.enableLighting = false;
                this.viewer.scene.fog.enabled = false;
                this.viewer.scene.skyAtmosphere.show = true;
                this.viewer.scene.globe.depthTestAgainstTerrain = false;

                if (sessionStorage.getItem("rows")) {
                    this.addPark();
                }
            });
        }, 1500);
    },
    methods: {
        ...mapMutations(["STORAGE"]),

        addLayer(e) {
            switch (e) {
                case 0:
                    this.viewer.imageryLayers.addImageryProvider(
                        new Cesium.UrlTemplateImageryProvider({
                            url:
                                "http://mt1.google.cn/vt/lyrs=s&hl=zh-CN&x={x}&y={y}&z={z}&s=Gali"
                        })
                    );
                    this.googleMap = true;
                    this.arcgisMap = false;
                    break;
                case 1:
                    this.viewer.imageryLayers.addImageryProvider(
                        new Cesium.ArcGisMapServerImageryProvider({
                            url:
                                "http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer"
                        })
                    );
                    this.googleMap = false;
                    this.arcgisMap = true;
                    break;
            }
        },

        handleFullScreen() {
            let element = document.documentElement;
            if (this.fullscreen) {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitCancelFullScreen) {
                    document.webkitCancelFullScreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
            } else {
                if (element.requestFullscreen) {
                    element.requestFullscreen();
                } else if (element.webkitRequestFullScreen) {
                    element.webkitRequestFullScreen();
                } else if (element.mozRequestFullScreen) {
                    element.mozRequestFullScreen();
                } else if (element.msRequestFullscreen) {
                    element.msRequestFullscreen();
                }
            }
            this.fullscreen = !this.fullscreen;
        },

        addPark() {
            this.removeSingle(this.mainPark);
            this.removeEntity(this.childPark);
            this.removeEntity(this.enterpriseList);
            this.openList = false;
            this.parkData = {
                parkData: JSON.parse(sessionStorage.getItem("rows")),
                imgList: JSON.parse(sessionStorage.getItem("rows")).img.split(
                    ","
                )
            };
            this.parkId = this.parkData.parkData.id;
            let child = this.parkData.parkData.parkChildList;
            if (child.length > 0) {
                for (let i = 0; i < child.length; i++) {
                    let layerData = JSON.parse(child[i].layerData);
                    let entity = this.viewer.entities.add({
                        polygon: {
                            hierarchy: Cesium.Cartesian3.fromDegreesArray(
                                layerData[0].position
                            ),
                            height: 0,
                            material: Cesium.Color.DEEPSKYBLUE.withAlpha(0.2),
                            outline: true,
                            outlineColor: Cesium.Color.AQUA.withAlpha(0)
                        },
                        click: () => {
                            this.openPark = true;
                            this.openEnt = false;
                        }
                    });
                    this.childPark.push(entity);

                    this.viewer.flyTo(entity, {
                        offset: {
                            heading: Cesium.Math.toRadians(0.0),
                            pitch: Cesium.Math.toRadians(-90)
                        }
                    });
                }
            } else {
                this.removeSingle(this.mainPark);
                let layerData = JSON.parse(this.parkData.parkData.layerData);
                this.mainPark = this.viewer.entities.add({
                    polygon: {
                        hierarchy: Cesium.Cartesian3.fromDegreesArray(
                            layerData[0].position
                        ),
                        height: 0,
                        material: Cesium.Color.DEEPSKYBLUE.withAlpha(0.2),
                        outline: true,
                        outlineColor: Cesium.Color.AQUA.withAlpha(0)
                    },
                    click: () => {
                        this.openPark = true;
                        this.openEnt = false;
                    }
                });
                this.viewer.flyTo(this.mainPark, {
                    offset: {
                        heading: Cesium.Math.toRadians(0.0),
                        pitch: Cesium.Math.toRadians(-90)
                    }
                });
            }

            setTimeout(() => {
                this.openPark = true;
                this.openManager = true;
                this.$emit("openNav");
                this.addMonitor();
            }, 3500);
        },

        removeSingle(e) {
            this.viewer.entities.remove(e);
        },

        removeEntity(e) {
            this.viewer.entities.remove(e);
            for (let i = 0; i < e.length; i++) {
                this.viewer.entities.remove(e[i]);
            }
        },

        addEnterprise() {
            getEnterprise({
                params: {
                    parkId: this.parkId
                }
            })
                .then(reps => {
                    if (reps.data.code === 0) {
                        let enterprise = reps.data.rows;
                        for (let i = 0; i < enterprise.length; i++) {
                            let latlon = JSON.parse(enterprise[i].latlon);
                            let entity = this.viewer.entities.add({
                                data: enterprise[i],
                                position: Cesium.Cartesian3.fromDegrees(
                                    latlon.x,
                                    latlon.y
                                ),
                                billboard: {
                                    image: require("../../assets/marker.png")
                                },
                                click: () => {
                                    this.addFiles(enterprise[i]);
                                    this.openPark = false;
                                }
                            });
                            this.enterpriseList.push(entity);
                            this.bindTooltip(this.enterpriseList);
                        }
                        this.total = this.enterpriseList.length;
                        this.openList = true;
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        },

        handelSelect(item) {
            this.viewer.camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(
                    JSON.parse(item.latlon).x,
                    JSON.parse(item.latlon).y,
                    500
                )
            });
            this.addFiles(item);
        },

        handelChoose(item) {
            let location = JSON.parse(item.latlon);
            this.viewer.camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(
                    location[0].x,
                    location[0].y,
                    500
                )
            });
        },

        addFiles(item) {
            getFiles({
                params: {
                    entId: item.id
                }
            })
                .then(reps => {
                    this.enterprise = {
                        enterprise: item,
                        imgList: item.img.split(","),
                        fileList: reps.data.rows
                    };
                    this.openEnt = true;
                })
                .catch(err => {
                    console.log(err);
                });
        },

        addCamera() {
            getCamera({
                params: {
                    parkId: this.parkId
                }
            })
                .then(reps => {
                    if (reps.data.code === 0) {
                        let camera = [];
                        camera = reps.data.rows;
                        for (let i = 0; i < camera.length; i++) {
                            let latlon = JSON.parse(camera[i].latlon);
                            let entity = this.viewer.entities.add({
                                data: camera[i],
                                position: Cesium.Cartesian3.fromDegrees(
                                    latlon[0].x,
                                    latlon[0].y
                                ),
                                billboard: {
                                    image: require("../../assets/camera.png")
                                },
                                click: e => {
                                    this.camera = e;
                                    this.openCam = true;
                                }
                            });
                            this.cameraList.push(entity);
                            this.bindTooltip(this.cameraList);
                        }
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        },

        addSensor() {
            getSensor({
                params: {
                    parkId: this.parkId
                }
            })
                .then(reps => {
                    if (reps.data.code === 0) {
                        let sensor = [];
                        sensor = reps.data.rows;
                        for (let i = 0; i < sensor.length; i++) {
                            let latlon = JSON.parse(sensor[i].latlon);
                            let entity = this.viewer.entities.add({
                                data: sensor[i],
                                position: Cesium.Cartesian3.fromDegrees(
                                    latlon[0].x,
                                    latlon[0].y
                                ),
                                billboard: {
                                    image: require("../../assets/senior.png")
                                }
                            });
                            this.sensorList.push(entity);
                            this.bindTooltip(this.sensorList);
                        }
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        },

        addMonitor() {
            getMonitor({
                params: {
                    parkId: this.parkId
                }
            })
                .then(reps => {
                    this.monitorList = reps.data.rows;
                    for (let i = 0; i < this.monitorList.length; i++) {
                        let type = this.monitorList[i].params.parkMonitorDict
                            .dictValue;
                        switch (type) {
                            case "大气环境监测点":
                                this.airList.push(this.monitorList[i]);
                                break;
                            case "地表水环境监测点":
                                this.surfaceWaterList.push(this.monitorList[i]);
                                break;
                            case "地下水监测点":
                                this.groundwaterList.push(this.monitorList[i]);
                                break;
                            case "声环境监测点":
                                this.voiceList.push(this.monitorList[i]);
                                break;
                            case "土壤环境监测点":
                                this.soilList.push(this.monitorList[i]);
                                break;
                        }
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        },

        addAirPoint() {
            if (this.airList.length > 0) {
                for (let i = 0; i < this.airList.length; i++) {
                    let latlon = JSON.parse(this.airList[i].latlon);
                    for (let j = 0; j < latlon.length; j++) {
                        let point = this.viewer.entities.add({
                            data: this.airList[i],
                            position: Cesium.Cartesian3.fromDegrees(
                                latlon[j].x,
                                latlon[j].y
                            ),
                            ellipse: {
                                height: 0.0,
                                semiMinorAxis: 50.0,
                                semiMajorAxis: 50.0,
                                material: new mars3d.CircleFadeMaterial({
                                    color: new Cesium.Color(0, 255, 0, 0.7)
                                })
                            },
                            billboard: {
                                image: require("../../assets/air.png")
                            }
                        });
                        this.airPoint.push(point);
                        this.bindPopup(this.airPoint);
                    }
                }
            } else {
                this.$message({
                    message: "暂无此类数据",
                    type: "error"
                });
            }
        },

        addSurfaceWaterPoint() {
            if (this.surfaceWaterList.length > 0) {
                for (let i = 0; i < this.surfaceWaterList.length; i++) {
                    let latlon = JSON.parse(this.surfaceWaterList[i].latlon);
                    for (let j = 0; j < latlon.length; j++) {
                        let point = this.viewer.entities.add({
                            data: this.surfaceWaterList[i],
                            position: Cesium.Cartesian3.fromDegrees(
                                latlon[j].x,
                                latlon[j].y
                            ),
                            ellipse: {
                                height: 0.0,
                                semiMinorAxis: 50.0,
                                semiMajorAxis: 50.0,
                                material: new mars3d.CircleFadeMaterial({
                                    color: new Cesium.Color(0, 255, 0, 0.7)
                                })
                            },
                            billboard: {
                                image: require("../../assets/sur.png")
                            }
                        });
                        this.surfaceWaterPoint(point);
                        this.bindPopup(this.surfaceWaterPoint);
                    }
                }
            } else {
                this.$message({
                    message: "暂无此类数据",
                    type: "error"
                });
            }
        },

        addGroundwaterPoint() {
            if (this.groundwaterList.length > 0) {
                for (let i = 0; i < this.groundwaterList.length; i++) {
                    let latlon = JSON.parse(this.groundwaterList[i].latlon);
                    for (let j = 0; j < latlon.length; j++) {
                        let point = this.viewer.entities.add({
                            data: this.groundwaterList[i],
                            position: Cesium.Cartesian3.fromDegrees(
                                latlon[j].x,
                                latlon[j].y
                            ),
                            ellipse: {
                                height: 0.0,
                                semiMinorAxis: 50.0,
                                semiMajorAxis: 50.0,
                                material: new mars3d.CircleFadeMaterial({
                                    color: new Cesium.Color(0, 255, 0, 0.7)
                                })
                            },
                            billboard: {
                                image: require("../../assets/gro.png")
                            }
                        });
                        this.groundwaterPoint.push(point);
                        this.bindPopup(this.groundwaterPoint);
                    }
                }
            } else {
                this.$message({
                    message: "暂无此类数据",
                    type: "error"
                });
            }
        },

        addVoicePoint() {
            if (this.voiceList.length > 0) {
                for (let i = 0; i < this.voiceList.length; i++) {
                    let latlon = JSON.parse(this.voiceList[i].latlon);
                    for (let j = 0; j < latlon.length; j++) {
                        let point = this.viewer.entities.add({
                            data: this.voiceList[i],
                            position: Cesium.Cartesian3.fromDegrees(
                                latlon[i].x,
                                latlon[i].y
                            ),
                            ellipse: {
                                height: 0.0,
                                semiMinorAxis: 50.0,
                                semiMajorAxis: 50.0,
                                material: new mars3d.CircleFadeMaterial({
                                    color: new Cesium.Color(0, 255, 0, 0.7)
                                })
                            },
                            billboard: {
                                image: require("../../assets/voi.png")
                            }
                        });
                        this.voicePoint.push(point);
                        this.bindPopup(this.voicePoint);
                    }
                }
            } else {
                this.$message({
                    message: "暂无此类数据",
                    type: "error"
                });
            }
        },

        addSoilPoint() {
            if (this.soilList.length > 0) {
                for (let i = 0; i < this.soilList.length; i++) {
                    let latlon = JSON.parse(this.soilList[i].latlon);
                    for (let j = 0; j < latlon.length; j++) {
                        let point = this.viewer.entities.add({
                            data: this.soilList[i],
                            position: Cesium.Cartesian3.fromDegrees(
                                latlon[j].x,
                                latlon[j].y
                            ),
                            ellipse: {
                                height: 0.0,
                                semiMinorAxis: 50.0,
                                semiMajorAxis: 50.0,
                                material: new mars3d.CircleFadeMaterial({
                                    color: new Cesium.Color(0, 255, 0, 0.7)
                                })
                            },
                            billboard: {
                                image: require("../../assets/soi.png")
                            }
                        });
                        this.soilPoint.push(point);
                        this.bindPopup(this.soilPoint);
                    }
                }
            } else {
                this.$message({
                    message: "暂无此类数据",
                    type: "error"
                });
            }
        },

        bindTooltip(e) {
            switch (e) {
                case this.enterpriseList:
                    for (let i = 0; i < this.enterpriseList.length; i++) {
                        let html =
                            '<div class="tooltip"><p>名称：' +
                            this.enterpriseList[i].data.name +
                            "</p><p>地址：" +
                            this.enterpriseList[i].data.address +
                            "</p></div>";
                        this.enterpriseList[i].tooltip = {
                            html: html,
                            anchor: [0, -10]
                        };
                    }
                    break;
                case this.cameraList:
                    for (let i = 0; i < this.cameraList.length; i++) {
                        let html =
                            '<div class="tooltip"><p>名称：' +
                            this.cameraList[i].data.name +
                            "</p><p>位置：" +
                            this.cameraList[i].data.address +
                            "</p></div>";
                        this.cameraList[i].tooltip = {
                            html: html,
                            anchor: [0, -10]
                        };
                    }
                    break;
                case this.sensorList:
                    for (let i = 0; i < this.sensorList.length; i++) {
                        let html =
                            '<div class="tooltip"><p>名称：' +
                            this.sensorList[i].data.name +
                            "</p><p>位置：" +
                            this.sensorList[i].data.address +
                            "</p></div>";
                        this.sensorList[i].tooltip = {
                            html: html,
                            anchor: [0, -10]
                        };
                    }
                    break;
            }
        },

        bindPopup(e) {
            switch (e) {
                case this.airPoint:
                    for (let i = 0; i < this.airPoint.length; i++) {
                        let html =
                            '<div class="tooltip"><p>测点名称：' +
                            this.airPoint[i].data.name +
                            "</p><p>测点类型：" +
                            this.airPoint[i].data.params.parkMonitorDict
                                .dictValue +
                            '</p><div id="point"></div></div>';
                        this.airPoint[i].popup = {
                            html: html,
                            anchor: [0, -10]
                        };
                    }
                    break;
                case this.surfaceWaterPoint:
                    for (let i = 0; i < this.surfaceWaterPoint.length; i++) {
                        let html =
                            '<div class="tooltip"><p>测点名称：' +
                            this.surfaceWaterPoint[i].data.name +
                            "</p><p>测点类型：" +
                            this.surfaceWaterPoint[i].data.params
                                .parkMonitorDict.dictValue +
                            '</p><div id="point"></div></div>';
                        this.surfaceWaterPoint[i].popup = {
                            html: html,
                            anchor: [0, -10]
                        };
                    }
                    break;
                case this.groundwaterPoint:
                    for (let i = 0; i < this.groundwaterPoint.length; i++) {
                        let html =
                            '<div class="tooltip"><p>测点名称：' +
                            this.groundwaterPoint[i].data.name +
                            "</p><p>测点类型：" +
                            this.groundwaterPoint[i].data.params.parkMonitorDict
                                .dictValue +
                            '</p><div id="point"></div></div>';
                        this.groundwaterPoint[i].popup = {
                            html: html,
                            anchor: [0, -10]
                        };
                    }
                    break;
                case this.voicePoint:
                    for (let i = 0; i < this.voicePoint.length; i++) {
                        let html =
                            '<div class="tooltip"><p>测点名称：' +
                            this.voicePoint[i].data.name +
                            "</p><p>测点类型：" +
                            this.voicePoint[i].data.params.parkMonitorDict
                                .dictValue +
                            '</p><div id="point"></div></div>';
                        this.voicePoint[i].popup = {
                            html: html,
                            anchor: [0, -10]
                        };
                    }
                    break;
                case this.soilPoint:
                    for (let i = 0; i < this.soilPoint.length; i++) {
                        let html =
                            '<div class="tooltip"><p>测点名称：' +
                            this.soilPoint[i].data.name +
                            "</p><p>测点类型：" +
                            this.soilPoint[i].data.params.parkMonitorDict
                                .dictValue +
                            '</p><div id="point"></div></div>';
                        this.soilPoint[i].popup = {
                            html: html,
                            anchor: [0, -10]
                        };
                    }
                    break;
            }
        },

        handleCheckChange(data, checked) {
            let value = data.label;
            switch (value) {
                case "企业":
                    if (checked == true) {
                        this.addEnterprise();
                        this.openMon = false;
                    } else {
                        this.removeEntity(this.enterpriseList);
                        this.enterpriseList.length = 0;
                    }
                    break;
                case "摄像头":
                    if (checked == true) {
                        this.addCamera();
                    } else {
                        this.removeEntity(this.cameraList);
                        this.cameraList.length = 0;
                    }
                    break;
                case "物联网监测设备":
                    if (checked == true) {
                        this.addSensor();
                    } else {
                        this.removeEntity(this.sensorList);
                        this.sensorList.length = 0;
                    }
                    break;
                case "大气监测点":
                    if (checked == true) {
                        this.openMon = true;
                        this.openList = false;
                        this.addAirPoint();
                    } else {
                        this.removeEntity(this.airPoint);
                        this.airPoint.length = 0;
                    }
                    break;
                case "地表水监测点":
                    if (checked == true) {
                        this.openMon = true;
                        this.openList = false;
                        this.addSurfaceWaterPoint();
                    } else {
                        this.removeEntity(this.surfaceWaterPoint);
                        this.surfaceWaterPoint.length = 0;
                    }
                    break;
                case "地下水监测点":
                    if (checked == true) {
                        this.openMon = true;
                        this.openList = false;
                        this.addGroundwaterPoint();
                    } else {
                        this.removeEntity(this.groundwaterPoint);
                        this.groundwaterPoint.length = 0;
                    }
                    break;
                case "土壤监测点":
                    if (checked == true) {
                        this.openMon = true;
                        this.openList = false;
                        this.addSoilPoint();
                    } else {
                        this.removeEntity(this.soilPoint);
                        this.soilPoint.length = 0;
                    }
                    break;
                case "声监测点":
                    if (checked == true) {
                        this.openMon = true;
                        this.openList = false;
                        this.addVoicePoint();
                    } else {
                        this.removeEntity(this.voicePoint);
                        this.voicePoint.length = 0;
                    }
                    break;
            }
        },

        currentChange(currentPage) {
            this.currentPage = currentPage;
        }
    },
    watch: {
        "$store.state.isPark": function() {
            this.addPark();
        }
    }
};
</script>