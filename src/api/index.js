import axios from "axios";
import {config} from '../../constants'


export const api =({headers={},...options})=>{
    let extraHeaders = {
        authorization: `Bearer ${config.TOKEN}`
    }
   return  axios({
       ...options,
       headers:{
        ...headers,
        ...extraHeaders
       }
    })
}