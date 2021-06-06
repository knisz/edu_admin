<template>
  <div class="app-container">
    <!--查询表单-->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="teacherQuery.name" placeholder="讲师名" />
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="teacherQuery.level"
          clearable
          placeholder="讲师头衔"
        >
          <el-option :value="1" label="高级讲师" />
          <el-option :value="2" label="首席讲师" />
        </el-select>
      </el-form-item>
      <el-form-item label="添加时间">
        <el-date-picker
          v-model="teacherQuery.begin"
          type="datetime"
          placeholder="选择开始时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="teacherQuery.end"
          type="datetime"
          placeholder="选择截止时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="getList()"
        >查 询</el-button
      >
      <el-button type="default" @click="resetData()">清空</el-button>
    </el-form>

    <!-- 表格 -->
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="数据加载中"
      border
      fit
      highlight-current-row
    >
      <el-table-column label="序号" width="70" align="center">
        <template slot-scope="scope">{{
          (page - 1) * limit + scope.$index + 1
        }}</template>
      </el-table-column>
      <el-table-column prop="name" label="名称" width="80" />

      <el-table-column label="头衔" width="80">
        <template slot-scope="scope">{{
          scope.row.level === 1 ? "高级讲师" : "首席讲师"
        }}</template>
      </el-table-column>

      <el-table-column prop="intro" label="资历" />
      <el-table-column prop="gmtCreate" label="添加时间" width="160" />
      <el-table-column prop="sort" label="排序" width="60" />

      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <!-- 通过路由跳转 -->
          <router-link :to="'/teacher/edit/' + scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">
              修改
            </el-button>
          </router-link>
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="removeDataById(scope.row.id)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <!-- 主要修改前三个分页信息和最后一个调用方法 -->
    <!-- 分页 -->
    <el-pagination
      :current-page="page"
      :page-sizes="[1,10,20,30,50]"
      :page-size="limit"
      :total="total"
      style="padding: 30px 0; text-align: center;"
     layout="total, prev, pager, next, jumper"
      @current-change="getList"
    />

  <!-- 公共分页 开始 -->
      <!-- <div>
        <div class="paging">
          <!- undisable这个class是否存在，取决于数据属性hasPrevious ->
          <a
            :class="{undisable: !data.hasPrevious}"
            href="#"
            title="首页"
            @click.prevent="gotoPage(1)">首页</a>

          <a
            :class="{undisable: !data.hasPrevious}"
            href="#"
            title="前一页"
            @click.prevent="gotoPage(data.current-1)">&lt;</a>

          <a
            v-for="page in data.pages"
            :key="page"
            :class="{current: data.current == page, undisable: data.current == page}"
            :title="'第'+page+'页'"
            href="#"
            @click.prevent="gotoPage(page)">{{ page }}</a>

          <a
            :class="{undisable: !data.hasNext}"
            href="#"
            title="后一页"
            @click.prevent="gotoPage(data.current+1)">&gt;</a>

          <a
            :class="{undisable: !data.hasNext}"
            href="#"
            title="末页"
            @click.prevent="gotoPage(data.pages)">末页</a>

          <div class="clear"/>
        </div>
      </div> -->
      <!-- 公共分页 结束 -->




  </div>
</template>

<script>
import teacher from "@/api/edu/teacher.js";
export default {
  //在这里写核心代码
  // data:{

  // },   //这种data写法不可以，要用下面这种
  data() {
    //定义变量和初始值
    return {
      list: null, //查询完成后接口返回的集合
      page: 1,
      limit: 10,
      total: 0,
      teacherQuery: {
        //条件封装对象
      },
    };
  },
  created() {
    //页面渲染之前执行，一般是调用method中的方法
    this.getList();
  },
  methods: {
    //创建具体的方法，调用teacher.js的方法
    //讲师列表的方法，参数表示不传值时默认是1
    getList(page = 1) {
      this.page = page;
      this.listLoading = true;
      //axios.post("").then().catch()    //原始方法
      teacher
        .getTeacherListPage(this.page, this.limit, this.teacherQuery)
        .then((response) => {
          //document.write(response);
          //console.log(response.data.items.records);
          //this.list = response.data.rows;
          console.log(response.data);
          this.list = response.data.items.records;
          this.total = response.data.items.total;
          this.listLoading = false;
        })
        .catch((error) => {
          document.write(error);
        });
    },
    resetData() {
      this.teacherQuery = {};
      this.getList();
    },
    removeDataById(id) {
      // debugger
      // console.log(memberId)
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          return teacher.deleteTeacherId(id);
        })
        .then(() => {
          this.getList(this.page);
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch((response) => {
          console.log(response);
          // 失败
          if (response === "cancel") {
            this.$message({
              type: "info",
              message: "已取消删除",
            });
          } else {
            this.$message({
              type: "error",
              message: "删除失败",
            });
          }
        });
    },
  
    //   methods: {
    //     getList() { // 调用api层获取数据库中的数据
    //       console.log('加载列表')
    //       this.page = page
    //       this.listLoading = true
    //       teacher.getTeacherListPage(this.page, this.limit, this.teacherQuery).then(response => {
    //         // debugger 设置断点调试
    //         if (response.success === true) {
    //           console.log(response)
    //           this.list = response.data.rows
    //           this.total = response.data.total
    //         }
    //         this.listLoading = false
    //       })
    //     }
    //   }
  },
};
</script>