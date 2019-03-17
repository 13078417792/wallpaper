import http from './http'
import api from './api'
import VueCookie from 'vue-cookie'
import {computed_skip as com_skip} from './helper'

type requestResult = {
    code:number,
    msg:string,
    sessionId:string|null|undefined
}|any

export const login = function(email:string,pwd:string,autoSave:boolean=true) :Promise<requestResult>{
    return http.post(api.login,{
        email,passwd:pwd
    }).then((result:requestResult)=>{
        const sessionId:string|null = result.sessionId
        if(!sessionId || result.code!==0){
            return Promise.reject(result.msg || '登录失败')
        }
        if(autoSave){
            VueCookie.set('Auth',sessionId,{expires:`${3600*24}s`})
        }
        return Promise.resolve(result)
    })
}


type album_list_params_type = {
    limit:number,
    first:number,
    order:"new"|"hot",
    page:number
}

export const album_list = function(params:album_list_params_type={
    limit:10,
    first:1,
    order:'new',
    page:1
}){
    let {limit,first,order,page} = params
    if(typeof first==='undefined'){
        first = 1
    }
    if(typeof page==='undefined'){
        page = 1
    }
    if(typeof order==='undefined'){
        order = 'new'
    }
    const skip = com_skip(page,limit)
    const data = {limit,first,order,skip}
    return http.get(api.album,{
        params:data
    }).then(result=>{
        return Promise.resolve(result)
    })
}

export const album_detail = function(){

}

export default {
    login,album_list
}