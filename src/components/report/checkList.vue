<template>
  <el-row class="wrap">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>报告审核</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>
    <el-col :span="24" class="wrap-main">
      <el-form size="small" :inline="true">
        <el-form-item>
          <el-input v-model="filters.name" placeholder="描述/文件名/作者/创建时间" style="min-width: 240px;"
                    @keyup.enter.native="handleSearch"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="fileRows" border size="small"><!--
        <el-table-column label="预览">
          <template slot-scope="scope">
            <img :src="scope.row.url" width="70" height="50">
          </template>
        </el-table-column>
        <el-table-column label="类型" prop="type">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.type === 1">图片</el-tag>
          </template>
        </el-table-column>-->
        <el-table-column label="id" prop="id"></el-table-column>
        <el-table-column label="描述" prop="description"></el-table-column>
        <el-table-column label="文件名" prop="fileName"></el-table-column>
        <el-table-column label="创建日期" prop="createTime"></el-table-column>
        <el-table-column label="对应角色" prop="roleNames"></el-table-column>
        <el-table-column label="审核" prop="status">
          <template slot-scope="scope">
              <el-button type="success" size="mini" @click="writePassGuidance(scope.row.id)">通过</el-button>
              <el-button type="danger" size="mini" @click="writeFailGuidance(scope.row.id)">不通过</el-button>
          </template>
        </el-table-column>
        <el-table-column label="当前状态" prop="status">
          <template slot-scope="scope">
            <el-button type="success" size="mini" v-if="scope.row.status === 1" @click="showGuidance(scope.row.id)">通过</el-button>
            <el-button type="danger" size="mini" v-else-if="scope.row.status === 2" @click="showGuidance(scope.row.id)">未通过</el-button>
            <el-button type="warning" size="mini" v-else-if="scope.row.status === 3" >待审核</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="submitDownLoad(scope.row.filePath, scope.row.fileName)" size="mini" type="success">下载</el-button>
            <el-button @click="removeFile(scope.row.id)" size="mini" type="danger">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination layout="total,prev, pager, next" @current-change="search" :page-size="limit"
                     :total="total"
                     style="float:right;">
      </el-pagination>
    </el-col>
  </el-row>
</template>

<script>
  import API from '../../api/api_file'
  import ROLE_API from "../../api/api_role";
  import REPORT_API from "../../api/api_report"

  export default {
    name: "List",
    data() {
      return {
        filters: {
          name: ""
        },
        limit: 10,
        page: 1,
        total: 0,
        roles: [],
        fileRows: [],
        resPath: '',
        fileName: '',
        roleNames: '',
        uploadUrl: '',
        uploadData: {},
        uploadHeaders: {Authorization: ''},
        addFormVisible: false,
        editFormVisible: false,
        editFormRules: {
          description: [
            {required: true, message: "请输入描述信息", trigger: "blur"}
          ],
        },
        editForm: {
          description: "",
          roleId: [],
          file:"",
        },
        //新增相关数据
        addFormVisible: false, //新增界面是否显示
        addLoading: false,
        addFormRules: {
          description: [
            {required: true, message: "请输入描述信息", trigger: "blur"}
          ]
        },
        addForm: {
          description: "",
          roleId: [],
        }
      }
    },
    methods: {
      handleSearch() {
        this.total = 0;
        this.page = 1;
        this.search();
      },
      search: function (val) {
        let that = this
        let params = {
          limit: that.limit,
          page: val,
          name: that.filters.name
        }
        this.page = val
        REPORT_API.findCheckList(params).then(res => {
          if (res.code === 0) {
            that.fileRows = res.page.rows
            that.total = res.page.total
          }
        })

      },
      writePassGuidance: function (id) {
        let that = this;
        this.$prompt('请输入指导（/纠正）意见', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(({value}) => {
          let params = {
            guidance: value,
            id: id,
            status: 1
          };
          REPORT_API.writeGuidance(JSON.stringify(params)).then(res => {
            if (res.code === 0) {
              that.$message.success({
                showClose: true,
                message: "操作成功",
                duration: 1500
              });
              that.search();
            } else {
              that.$message.error({
                showClose: true,
                message: "操作失败",
                duration: 1500
              })
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });
        });
      },
      writeFailGuidance: function (id) {
        let that = this;
        this.$prompt('请输入指导（/纠正）意见', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(({value}) => {
          let params = {
            "guidance": value,
            "id": id,
            "status": 2
          };
          REPORT_API.writeGuidance(params).then(res => {
            if (res.code === 0) {
              that.$message.success({
                showClose: true,
                message: "操作成功",
                duration: 1500
              });
              that.search();
            } else {
              that.$message.error({
                showClose: true,
                message: "操作失败",
                duration: 1500
              })
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });
        });
      },
      showGuidance: function (id) {
        let that = this;
        REPORT_API.getGuidance({id: id}).then(res => {
          if (res.code === 0) {
            this.$alert(res.guidance, '指导意见', {
              confirmButtonText: '确定',
              callback: action => {
                this.$message({
                  type: 'info',
                  message: `action: ${action}`
                });
              }
            });
          }
        })
      },
      submitDownLoad(filePath, fileName) {
        let fields = [{
          name: 'filePath',
          value: filePath
        }, {
          name: 'fileName',
          value: fileName
        }];
        const form = document.createElement('form');
        form.action = process.env.API_ROOT + '/api-cms/file/download';
        form.method = 'POST';
        form.target = 'downloadFrame';
        for (let i = 0, l = fields.length; i < l; i++) {
          const field = fields[i];
          const f = document.createElement('input');
          f.type = 'hidden';
          f.name = field.name;
          f.value = field.value;
          form.appendChild(f);
        }
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
        /*return new Promise((resolve, reject) => {
          let that=this;
          API.download(params).then(function (result) {
            if (result) {
                that.download(result);
            }
          }).catch(function (err) {
            that.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
          });
        }).catch(err => {
          console.log(err);
          that.$message.error({
            showClose: true,
            message: "请求出现异常",
            duration: 2000
          });
          reject(false);
        })*/
      },
      // 下载文件
      download(data) {
        if (!data) {
          return
        }
        let url = window.URL.createObjectURL(new Blob([data]))
        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', 'excel.xlsx')

        document.body.appendChild(link)
        link.click()
      },
      removeFile: function (id) {
        let that = this;
        this.$confirm("确认删除该记录吗?", "提示", {type: "warning"})
          .then(() => {
            that.loading = true;
            return PLAN_API.removePlan({id: id})
              .then(
                function (result) {
                  that.loading = false;
                  if (result && parseInt(result.code) === 0) {
                    that.$message.success({
                      showClose: true,
                      message: "删除成功",
                      duration: 1500
                    });
                    that.search();
                  }
                }
              ),
              function (err) {
                that.loading = false;
                that.$message.error({
                  showClose: true,
                  message: err.toString(),
                  duration: 2000
                });
              }
                .catch(function (error) {
                  that.loading = false;
                  console.log(error);
                  that.$message.error({
                    showClose: true,
                    message: "请求出现异常",
                    duration: 2000
                  });
                });
          })
          .catch(() => {
          });
      },
      onSuccess: function (res, file) {
        let that = this;
        that.resPath = res.data.resPath;
        that.fileName = res.data.fileName;
        this.search(this.page);
      },
    },

    mounted() {
      this.search(1);
    }
  }
</script>

<style scoped>

</style>
