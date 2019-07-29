import { Message } from 'element-ui';

export var success=function(str){
    Message({
        message:str,
        type:'success'

    })
}

export var error=function(str){
    Message({
        message:str,
        type:'error'

    })
}


export var warning=function(str){
    Message({
        message:str,
        type:'warning'

    })
}

export var info=function(str){
    Message({
        message:str,
        type:'info'

    })
}