<template>
  <el-row class="wrap">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb>
        <el-breadcrumb-item>首页</el-breadcrumb-item>
        <el-breadcrumb-item>教学安排管理</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>
    <el-col :span="24" class="wrap-main">
      <el-form size="small" :inline="true">
        <el-form-item>
          <el-input></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="showAddDialog">上传新的教学安排</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="fileRows" border size="small">
        <el-table-column label="预览">
          <template slot-scope="scope">
            <img :src="scope.row.url" width="70" height="50">
          </template>
        </el-table-column>
        <el-table-column label="类型" prop="type">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.type === 1">图片</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="路径" prop="url"></el-table-column>
        <el-table-column label="创建日期" prop="createDate"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
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
      <!-- 添加界面 -->
      <el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false">
        <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
          <el-form-item label="描述" prop="description">
            <el-input v-model="addForm.description" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="接收角色" prop="roleId">
            <el-checkbox-group v-model="roleId">
              <el-checkbox v-for="role in roles" :label="role.roleId" :key="role.roleId">{{role.roleName}}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="相关文件" prop="uploadFile">
            <el-upload :before-upload="beforeUpload" :action="uploadUrl" :data="uploadData" :headers="uploadHeaders"
                       :on-success="onSuccess">
              <el-button type="primary">上传</el-button>
            </el-upload>

          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="addFormVisible = false">取消</el-button>
          <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
        </div>
      </el-dialog>
      <!-- 编辑界面 -->
      <el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false">
        <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
          <el-form-item label="描述" prop="description">
            <el-input v-model="editForm.description" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="接收角色" prop="roleId">
            <el-checkbox-group v-model="roleId">
              <el-checkbox v-for="role in roles" :label="role.roleId" :key="role.roleId">{{role.roleName}}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="相关文件" prop="uploadFile">
            <el-upload :before-upload="beforeUpload" action="http://localhost:8002/api-cms/file/upload" :data="uploadData" :headers="uploadHeaders"
                       :on-success="onSuccess">
              <el-button type="primary">文件编辑</el-button>
            </el-upload>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="editFormVisible = false">取消</el-button>
          <el-button type="primary" @click.native="editSubmit" :loading="addLoading">提交</el-button>
        </div>
      </el-dialog>
    </el-col>
  </el-row>
</template>

<script>
  import API from '../../api/api_file'
  import ROLE_API from "../../api/api_role";
  import PLAN_API from "../../api/api_plan"

  export default {
    name: "List",
    data() {
      return {
        limit: 10,
        page: 1,
        total: 0,
        roles: [],
        roleId: [],
        fileRows: [],
        resPath: '',
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
      search: function (val) {
        let that = this
        let params = {
          limit: that.limit,
          page: val
        }
        this.page = val
        API.files(params).then(res => {
          if (res.code === 0) {
            that.fileRows = res.page.rows
            that.total = res.page.total
          }
        })

      },
      showAddDialog: function () {
        let that = this;
        this.addFormVisible = true;
        that.roleId = []
        ROLE_API.findList('').then(function (result) {
          that.roles = result.rows;
        })
      },
      showEditDialog: function (index, row) {
        let that = this;
        that.roleId = [];
        this.editFormVisible = true;
        this.editForm = Object.assign({}, row);
        ROLE_API.findList('').then(function (result) {
          that.roles = result.rows;
        })
        ROLE_API.findById(row.userId).then(function (result) {
          that.roleId = result;
        })
      },
      beforeUpload: function () {
        let that = this;
        return new Promise((resolve, reject) => {
          API.getToken().then(res => {
            let token = res.token;
            let key = res.key;
            that.uploadData = { key: key};
            that.uploadHeaders.Authorization = window.localStorage.getItem('access-token');
            that.uploadUrl = res.url;
            resolve(true)
          })
        }).catch(err => {
          console.log(err);
          reject(false)
        })
      },
      submitUpload(param) {
        let file = param.file;
        let that = this;
        return new Promise((resolve, reject) => {
          API.upload(file).then(res => {
            that.resPath=res.resPath;
            that.$message.success({
              showClose: true,
              message: "上传成功",
              duration: 1500
            });
            resolve(true);
          })
        }).catch(err => {
          console.log(err);
          that.$message.error({
            showClose: true,
            message: "请求出现异常",
            duration: 2000
          });
          reject(false);
        })
      },
      onUploadChange(file)
      {
        let reader = new FileReader();
        reader.readAsDataURL(file.raw);
        reader.onload = function(e){
          console.log(this.result)//图片的base64数据
        }
      },
      removeFile: function (id) {
        let that = this;
        return API.remove({id: id}).then(res => {
          if (res.code === 0) {
            that.$message.success(res.msg);
            that.search(this.page);
          }
        })
      },
      onSuccess: function (res,file) {
        let that = this;
        that.resPath=res.resPath;
        this.search(this.page);
      },
      addSubmit: function () {
        let that = this;
        this.$refs.addForm.validate(valid => {
          if (valid) {
            that.loading = true;
            let params = Object.assign({}, this.addForm);
            params.filePath = that.resPath
            PLAN_API.addPlan(params).then(function (result) {
              if (0 === result.code) {
                that.loading = false;
                that.$message;
                that.$message.success({
                  showClose: true,
                  message: "新增成功",
                  duration: 2000
                });
                that.$refs["addForm"].resetFields();
                that.addFormVisible = false;
                that.search();
              } else {
                that.$message.error({
                  showClose: true,
                  message: "修改失败",
                  duration: 2000
                });
              }
            });
          }
        });
      },
      editSubmit: function () {
        let that = this;
        this.$refs.editForm.validate(valid => {
          if (valid) {
            that.loading = true;
            let params = Object.assign({}, that.editForm);
            params.roleId = that.roleId
            API.editUser(params).then(function (result) {
                if (0 === result.code) {
                  // that.loading = false;
                  // that.$message;
                  that.$message.success({
                    showClose: true,
                    message: "修改成功",
                    duration: 2000
                  });
                  that.$refs["editForm"].resetFields();
                  that.editFormVisible = false;
                  that.search();
                } else {
                  that.$message.error({
                    showClose: true,
                    message: "修改失败",
                    duration: 2000
                  });
                }
              },
              function (err) {
                that.loading = false;
                that.$message.error({
                  showClose: true,
                  message: err.toString(),
                  duration: 2000
                });
              }
            )
              .catch(function (error) {
                that.loading = false;
                console.log(error);
                that.$message.error({
                  showClose: true,
                  message: "请求出现异常",
                  duration: 2000
                });
              });
          }
        });
      },
      removeUser: function (index, row) {
        let that = this;
        this.$confirm("确认删除该记录吗?", "提示", {type: "warning"})
          .then(() => {
            that.loading = true;
            API.removeUser({id: row.userId})
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
      }
    },

    mounted() {
      this.search(1);
    }
  }
</script>

<style scoped>

</style>
