<template>
    <div>
        
       <el-upload
            class="avatar-uploader"
            action=""
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeupload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        </el-upload>

         
    </div>
</template>
 
<script>



   
    import OSS from 'ali-oss'
import { request } from 'http';

 
    export default {
        name: 'upload',
        data: function(){
            return {
                imageUrl: '',
          
            }
        },
        components: {
            
             
        },
       
        methods:{

             //获取文档内容
        getContent: function(){
          let content = this.$refs.ueditor.getUEContent();
          console.log(content);
          alert(content);
        },

             handleAvatarSuccess(res, file) {
                     
                },
             
             
            beforeupload(file){
                  this.$axios.post('http://localhost:7001/test/oss').then(result=>{
                     
                    const da=result.data
                    var storeAs = 'upload-file';
                     var suffx=file.name.substring(file.name.indexOf("."));
                     console.log(suffx)
                     var timestamp = da.dir+(new Date()).getTime()+suffx;
                     console.log(timestamp)
                     var client = new OSS({ 
                         key:timestamp,
                       policy: da.policy,
                        accessKeyId: da.accessid,
                        accessKeySecret : da.accesssecret,
                        bucket: 'mini-mall-image',
                        signature: da.signature,
                       region:'oss-cn-hangzhou'
 

                  }); 
                  const _that=this;

                    client.put(timestamp, file).then(function (result) {
                        console.log(result);
                         _that.imageUrl=result.url;
                         
                    }).catch(function (err) {
                        console.log(err);
                    });
                })
                return true;
            },
            handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePictureCardPreview(file) {
          console.log(file.url)
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      }
        },
        created(){
            this.cropImg = this.defaultSrc;
        }
    }
</script>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 180px;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
