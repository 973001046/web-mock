<template>
  <div class="wrap">
    <div class="content" v-if="activeRouter">
      <div class="top">
        <el-input placeholder="请输入搜索API名称" style="width:  400px" v-model.trim="search">
          <template slot="prepend">{{form.project}}</template>
        </el-input>

        <el-button class="btn" type="primary" @click="build">
          <i class="el-icon-folder-add el-icon--left"></i>
          新增API
        </el-button>
      </div>
      <el-table
        ref="filterTable"
        :data="apiList.filter(data => !search || data.interface.toLowerCase().includes(search.toLowerCase()))"
        style="width: 100%"
      >
        <el-table-column prop="interface" label="请求地址">
          <template slot-scope="scope">{{form.project}}{{scope.row.interface}}</template>
        </el-table-column>
        <el-table-column
          prop="tag"
          label="请求方式"
          width="100"
          :filters="[{ text: 'GET', value: 'GET' }, { text: 'POST', value: 'POST' }, { text: 'PUT', value: 'PUT' }, { text: 'DELETE', value: 'DELETE' }]"
          :filter-method="filterTag"
          filter-placement="bottom-end"
        >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.method === 'GET'" disable-transitions>{{scope.row.method}}</el-tag>
            <el-tag
              v-if="scope.row.method === 'POST'"
              type="success"
              disable-transitions
            >{{scope.row.method}}</el-tag>
            <el-tag
              v-if="scope.row.method === 'PUT'"
              type="warning"
              disable-transitions
            >{{scope.row.method}}</el-tag>
            <el-tag
              v-if="scope.row.method === 'DELETE'"
              type="danger"
              disable-transitions
            >{{scope.row.method}}</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="250" fixed="right">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="look('look', scope.row)">查看</el-button>
            <el-button type="warning" size="mini" @click="look('reset', scope.row)">修改</el-button>
            <el-button type="danger" size="mini" @click="look('delete', scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <tip v-else></tip>

    <el-dialog title="JSON" :visible.sync="dialogVisible" width="40%" :before-close="handleClose">
      <div>
        <pre class="pre"><code>{{showApi.data}}</code></pre>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <!-- <el-button type="primary" @click="dialogVisible = false">确 定</el-button> -->
      </span>
    </el-dialog>

    <el-dialog title="修改" :visible.sync="resetVisible" width="40%" :before-close="handleClose">
      <div>
        <el-form label-width="80px" :model="form">
          <el-form-item label="API名称">
            <!-- <el-input style="width: 250px" placeholder="请输入API名称" v-model="form.api"></el-input> -->
            <el-input placeholder="请输入内容" style="width: 90%" :disabled="flag" v-model="form.api">
              <template slot="prepend">{{form.project}}</template>
            </el-input>
          </el-form-item>

          <el-form-item label="请求方式">
            <el-select v-model="form.way" :disabled="flag" style="width: 90%" placeholder="请选择请求方式">
              <el-option label="GET" value="GET"></el-option>
              <el-option label="POST" value="POST"></el-option>
              <el-option label="PUT" value="PUT"></el-option>
              <el-option label="DELETE" value="DELETE"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="上传文件">
            <el-upload
              class="upload-demo"
              ref="upload"
              :auto-upload="false"
              :on-change="beforeAvatarUpload"
              :limit="1"
              action
              :file-list="fileList"
            >
              <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
              <div slot="tip" class="el-upload__tip">只能上传json文件</div>
            </el-upload>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetVisible = false; quit()">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import tip from '@/components/Tip'
import { mapState, mapActions } from 'vuex'
export default {
  name: 'Index',
  computed: mapState(['activeRouter', 'navList', 'apiList']),
  components: { tip },
  data () {
    return {
      dialogVisible: false,
      resetVisible: false,
      search: '',
      form: {
        project: 'app',
        way: '',
        api: '',
        file: ''
      },
      showApi: '',
      flag: true,
      fileList: []
    }
  },
  methods: {
    ...mapActions(['saveApi']),
    filterTag (value, row) {
      return row.method === value
    },
    look (way, item) {
      if (way === 'look') {
        this.dialogVisible = true
        this.showApi = item
      } else if (way === 'reset') {
        this.resetVisible = true
        this.form.api = item.interface
        this.form.way = item.method
      } else if (way === 'delete') {
        this.removePath(item.fullPath)
      }
    },
    removePath (path) {
      this.$confirm('确认删除此条API')
        .then(_ => {
          this.$http.delete('/delete', { path }).then((res) => {
            if (res.code === 200) {
              this.saveApi(this.form.project)
              this.$message.success('删除成功')
              this.saveApi(this.form.project)
            } else {
              this.$message.error('删除失败')
            }
          })
        })
    },
    handleClose (done) {
      done()
      this.quit()
    },
    handleAvatarSuccess (res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload (file) {
      let temp = file.raw
      const isJson = temp.type === 'application/json'
      if (!isJson) {
        this.$message.error('上传文件只能是 JSON 格式!')
        this.$refs.upload.clearFiles()
      } else {
        this.form.file = file
      }
    },
    submit () {
      if (!this.form.api) {
        this.$message.error('请输入API名')
      }
      if (!this.form.way) {
        this.$message.error('请选择请求方式')
      }
      if (!this.form.file) {
        this.$message.error('请上传JSON文件')
      }
      let formData = new FormData()
      formData.append('project', 'app')
      formData.append('way', this.form.way)
      formData.append('file', this.form.file.raw)
      formData.append('api', this.form.api)
      this.$http.post('/setApi', formData).then(res => {
        this.$message.success('修改成功')
        this.resetVisible = false
        this.saveApi(this.form.project)
        this.quit()
      }).catch((err) => {
        console.log(err)
      })
    },
    build () {
      this.resetVisible = true
      this.flag = false
    },
    quit () {
      this.form.way = ''
      this.form.api = ''
      this.form.file = ''
      this.fileList = []
      this.flag = true
    }
  },
  watch: {
    activeRouter (val) {
      this.form.project = this.navList[this.activeRouter].title
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.wrap {
  width: 100%;
}
.top {
  margin: 20px 0;
}
.btn {
  margin-left: 50px;
}
.content {
  padding: 10px;
  color: #545c64;
  width: 100%;
  box-sizing: border-box;
}
.pre {
  background-color: #545c64;
  color: #fff;
  padding: 8px;
  box-sizing: border-box;
  border-radius: 5px;
  max-height: 400px;
  overflow-y: auto;
}
.pre::-webkit-scrollbar {
  width: 4px;
  height: 4px;
  color: rgb(68, 162, 255);
}
.pre::-webkit-scrollbar-thumb {
  background-color: rgba(68, 162, 255, 0.9);
  border-radius: 5px;
  -webkit-box-shadow: inset 1px 1px 0 rgba(0, 0, 0, 0.1);
}
.upload-demo {
  display: inline-block;
}
.el-upload__tip {
  margin-top: 0;
  line-height: 25px;
}
</style>
