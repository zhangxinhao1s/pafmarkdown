import { dictgetDictOptions ,qyhgGetflowNodes} from "@/views/common/api/common.js";

const state = {
    mblist:{},
    mbProto:{},
    flowNodes:null,
}

const mutations = {
    'FLITER_MB_LIST':(state,payload)=>{
        for (let key in payload){
            state.mblist[key] = new Object
            payload[key].map(item=>{
                state.mblist[key][item.dictCode] = item.dictName
            })
        }
        console.log('mblistObj',state.mblist);
        state.mbProto = {...state.mbProto,...payload}
    },

    'FLITER_FLOW_NODES':(state,payload)=>{
        const flowNodeObj = {}
        payload.map(item=>{
            flowNodeObj[item.flowType] = new Object
            flowNodeObj[item.flowType].name = item.flowName
            flowNodeObj[item.flowType].code = item.flowType
            item.list?.map(curr=>{
                flowNodeObj[item.flowType][curr.flowNodeCode] = new Object
                flowNodeObj[item.flowType][curr.flowNodeCode].name = curr.flowNodeName
                flowNodeObj[item.flowType][curr.flowNodeCode].code = curr.flowNodeCode
            })
        } )
        state.flowNodes = flowNodeObj
        console.log('flowNodeObj',{...flowNodeObj});
    }
}

const actions ={

    dictgetDictOptions(store,{parmas}){
        const mblist = store.state.mbProto
        let Newparmas = parmas.split(',')
        for (let key in mblist ){
            if(Newparmas.indexOf(key) !== -1){
                const index = Newparmas.indexOf(key)
                Newparmas.splice(index,1)
            }
        }
        if(Newparmas.length>0){
            Newparmas = Newparmas.join()
            return dictgetDictOptions({dictTypeCode:Newparmas})
            .then(res=>{
                (res.code == 0 && res.success) && (store.commit('FLITER_MB_LIST',res.data))
            },err=>{})
        }else {return Promise.resolve(store.state.mblist)}
    },

    getFlowListNodes(store,payload){
        if(!store.state.flowNodes){
            return qyhgGetflowNodes({bizValueCode:payload||'YWLX_QYHG',pageNum:1,pageSize: 100})
            .then(res=>{
                (res.code == 0 && res.success) && (store.commit('FLITER_FLOW_NODES',res.data))
            },err=>{})
        }else{return Promise.resolve(store.state.flowNodes)}
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
};