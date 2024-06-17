<script>
import { checkAuth } from "../../utils/auth";
export default {
  name:'SPAuth',
  functional: true,
  props: {
    eleCode: { //当前元素编码
      type: String,
      default: "",
    },
    eleCodes: { //多元素编码控制的权限，优先于eleCode
      type: Array,
      default: ()=>{
          return []
      },
    }
  },
  render(h, context) {
    const { props, scopedSlots } = context;
    if(props.eleCodes && props.eleCodes.length > 0){
         let isValid = false
         for(let i=0;i<props.eleCodes.length;i++){
             if(checkAuth(props.eleCodes[i])){
                 isValid = true
                 break;
             }
         }
         return isValid? scopedSlots.default() : null;
    }else{
      return checkAuth(props.eleCode) ? scopedSlots.default() : null;
    }
  },
};
</script>