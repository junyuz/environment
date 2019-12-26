// import * as Cesium from "cesium/Cesium";
import mars3d from "./cesium-mars/mars3d";

export function createMap(id, config) {
  var viewer = mars3d.createMap({
    id: id,
    data: config.map3d,
    serverURL: config.serverURL,
    // backgroundColor: "rgba(0,0,0,0)",
    // style: { 
    //     skyBox: false, 
    //     moon: false, 
    //     sun: false, 
    //     atmosphere: true 
    // },
    // orderIndependentTranslucency: false,
    // contextOptions: { webgl: { alpha: true, } }
  });
  return viewer;
}
