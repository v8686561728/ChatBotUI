import axios from "axios";
import {config} from '../../constants'
import { getUserId } from "../redux/chat/chat-selectors";
import Store from '../redux/store'

export const api =({headers={},...options})=>{
    let userid = getUserId(Store.getState())
    let extraHeaders = {
        authorization: `Bearer ${config.TOKEN}`,
       ...(userid && {userid})
    }
   return  axios({
       ...options,
       headers:{
        ...headers,
        ...extraHeaders
       }
    })
}