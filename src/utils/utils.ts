import { config } from "../config/index.js";

export function loggerFormat(){
    return config.api.platform == "PRODUCTION"? "common" : "dev";  
}