<template>
  <div class="app-container">
    <el-form label-width="120px">



      <!-- 讲师头像 -->
      <el-form-item label="讲师头像">
        <!-- 头衔缩略图 -->
        <pan-thumb :image="teacher.avatar + ''" />
        <!-- 文件上传按钮 -->
        <el-button
          type="primary"
          icon="el-icon-upload"
          @click="imagecropperShow = true"
          >更换头像
        </el-button>

        <!--
            v-show：是否显示上传组件
            :key：类似于id，如果一个页面多个图片上传控件，可以做区分
            :url：后台上传的url地址
            @close：关闭上传组件
            @crop-upload-success：上传成功后的回调 
            <input type="file" name="file"/>
        -->
        <image-cropper
          v-show="imagecropperShow"
          :width="120"
          :height="120"
          :key="imagecropperKey"
          :url="BASE_API + '/eduoss/fileoss'"
          field="file"
          @close="close"
          @crop-upload-success="cropSuccess"
        />
      </el-form-item>


      <el-form-item label="讲师名称" >
        <el-input type="text" v-model="teacher.name" maxlength="10" show-word-limit style="width: 20%">
        </el-input>
      </el-form-item>
      
      
      <el-form-item label="讲师排序">
        <el-input-number
          v-model="teacher.sort"
          controls-position="right"
          :min="0"
        />
      </el-form-item>
      <el-form-item label="讲师头衔">
        <el-select v-model="teacher.level" clearable placeholder="请选择">
          <!--
                数据类型一定要和取出的json中的一致，否则没法回填
                因此，这里value使用动态绑定的值，保证其数据类型是number
            -->
          <el-option :value="1" label="高级讲师" />
          <el-option :value="2" label="首席讲师" />
        </el-select>
      </el-form-item>
      <el-form-item label="讲师资历">
        <el-input v-model="teacher.career" />
      </el-form-item>
      <el-form-item label="讲师简介">
        <el-input v-model="teacher.intro" :rows="10" type="textarea" />
      </el-form-item>

      <!-- 讲师头像：TODO -->


      <el-form-item>
        <el-button
          :disabled="saveBtnDisabled"
          type="primary"
          @click="saveOrUpdate"
          >保存</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import teacherApi from "@/api/edu/teacher";
import ImageCropper from "@/components/ImageCropper";
import PanThumb from "@/components/PanThumb";

export default {
  components: { ImageCropper, PanThumb },
  data() {
    return {
      teacher: {
        name: "",
        sort: 0,
        level: 1,
        career: "",
        intro: "",
        avatar: "",
      },
      imagecropperKey: 0, //上传组件key值
      BASE_API: process.env.BASE_API, //获取dev.env.js里面地址
      imagecropperShow: false, //上传弹框组件是否显示
      saveBtnDisabled: false, // 保存按钮是否禁用,
    };
  },
  created() {
    //console.log("created");
    this.init();
  },
  watch: {
    //监听路由，一旦路由变化，watch代码就会执行
    $route(to, from) {
      //console.log("watch $route");
      this.init();
    },
  },
  methods: {
    init() {
      if (this.$route.params && this.$route.params.id) {
        //如果路径中有id，表示修改
        const id = this.$route.params.id;
        this.getInfo(id);
      } else {
        //添加
        this.teacher = {}; //这种方式直接放在create方法中没用，必须在init中调用，因为create只运行一次
      }
    },
    //先查询讲师，再进行回显
    getInfo(id) {
      teacherApi.getTeacherInfo(id).then((response) => {
        this.teacher = response.data.teacher;
      });
    },
    saveOrUpdate() {
      if (!this.teacher.id) {
        this.saveData();
      } else {
        this.updateTeacher();
      }
    },

    //保存讲师
    saveData() {
      teacherApi.addTeacher(this.teacher).then((response) => {
        this.$message({
          type: "success",
          message: "添加成功!",
        });
        this.$router.push({ path: "/teacher/table" });
      });
    },

    //修改讲师
    updateTeacher(id) {
      teacherApi
        .updateTeacherInfo(this.teacher.id, this.teacher)
        .then((response) => {
          this.$message({
            type: "success",
            message: "修改成功!",
          });
          this.$router.push({ path: "/teacher/table" });
        });
    },

    //关闭上传弹窗的方法
    close() {
      this.imagecropperShow = false;
      //上传组件初始化
      this.imagecropperKey = this.imagecropperKey + 1;
    },

    //上传成功的方法
    cropSuccess(data) {
      //console.log(this.url),
      this.imagecropperShow = false;
      //上传之后接口返回图片地址
      this.teacher.avatar = data.url;
      this.imagecropperKey = this.imagecropperKey + 1;
    },
  },
};
</script>