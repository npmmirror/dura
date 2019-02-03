/**
 * @format
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import { AppRegistry } from "react-native";

import { name as appName } from "./app.json";
import App from "./dist/index";

AppRegistry.registerComponent(appName, () => App);
