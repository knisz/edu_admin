<template>
  <div class="app-container">
    <el-input
      v-model="filterText"
      placeholder="Filter keyword"
      style="margin-bottom: 30px"
    />

    <el-tree
      ref="tree2"
      :data="data2"
      :props="defaultProps"
      :filter-node-method="filterNode"
      class="filter-tree"
      default-expand-all
      :render-content="renderContent"
    />
    

    <!-- <el-tree
     ref="tree2"
      :data="data2"
      show-checkbox
      :props="defaultProps"
      class="filter-tree"
      :filter-node-method="filterNode"
      node-key="value"
      default-expand-all
      :expand-on-click-node="false"
      :render-content="renderContent"
    >
    </el-tree> -->

    <!-- <el-tree
         ref="tree2"
      :data="data2"
      show-checkbox
      node-key="id"
      default-expand-all
      :expand-on-click-node="false"
      :render-content="renderContent">
    </el-tree> -->
  </div>
</template>

<script>
import subject from "@/api/edu/subject";
export default {
  data() {
    return {
      filterText: "",
      data2: [], //返回的分类数据
      defaultProps: {
        children: "children",
        label: "title",
      },
    };
  },
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val);
    },
  },
  created() {
    this.getAllSubject();
  },

  methods: {
    getAllSubject() {
      subject.getSubject().then((response) => {
        console.log(response);
        this.data2 = response.data.list;
      });
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.title.toLowerCase().indexOf(value) !== -1;
    },
    renderContent(h, { node, data, store }) {
      return h(
        "span",
        {
          style: {
            //						color: "red",
          },
          //这里添加hover事件
          on: {
            mouseenter: () => {
              data.is_show = true;
            },
            //鼠标离开
            mouseleave: () => {
              data.is_show = false;
            },
          },
        },
        [
          h(
            "span",
            {
              //显示名称
            },
            node.label
          ),
          h(
            "span",
            {
              style: {
                display: data.is_show ? "" : "none",
              },
            },
            [
              //添加
              h(
                "el-button",
                {
                  props: {
                    type: "text",
                    size: "small",
                  },
                  style: {
                    marginLeft: "15px",
                  },
                  on: {
                    click: () => {
                      this.append(data);
                    },
                  },
                },
                "添加"
              ),
              h(
                "el-button",
                {
                  props: {
                    type: "text",
                    size: "small",
                  },
                  style: {},
                  on: {
                    click: () => {
                      this.amend(data);
                    },
                  },
                },
                "修改"
              ),
              h(
                "el-button",
                {
                  props: {
                    type: "text",
                    size: "small",
                  },
                  style: {},
                  on: {
                    click: () => {
                      this.remove(node, data);
                    },
                  },
                },
                "删除"
              ),
            ]
          ),
        ]
      );
    },
  },
};
</script>

