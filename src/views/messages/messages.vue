<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.id" placeholder="消息编号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.isDeal" placeholder="是否处理" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in isDealOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
      <el-select v-model="listQuery.messageType" placeholder="消息类型" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in messageTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column label="消息编号" prop="id" sortable="custom" align="center" width="110">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否处理" min-width="80px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.isDeal | isDealTypeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="消息类型" min-width="130px" align="center">
        <template slot-scope="{row}">
          <el-tag>{{ row.messageType | messageTypeFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="内容" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.content }}</span>
        </template>
      </el-table-column>
      <el-table-column label="会员" min-width="180px">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleCopy( row.lastUserId,$event)">会员ID：{{ row.lastUserId }}<br></span>
          <span class="link-type" @click="handleCopy( row.lastUserPhone,$event)">会员手机：{{ row.lastUserPhone }}  <i icon="el-icon-copy-document" /></span>
        </template>
      </el-table-column>
      <el-table-column label="时间" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="140" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button :type="row.isDeal?'info':'primary'" size="small" @click="handleUpdate(row)">
            {{ row.isDeal?'已处理':'更改状态' }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" style=" min-width: 200px;">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="80px" style="width: 94%; overflow: hidden;">
        <el-col :xs="24" :sm="12" :lg="12" class="editBox">
          <el-form-item label="是否处理">
            <el-select v-model="temp.isDeal" placeholder="是否处理" clearable class="filter-item" style="width: 130px">
              <el-option v-for="item in isDealOptions" :key="item.key" :label="item.display_name" :value="item.key" />
            </el-select>          </el-form-item>
        </el-col>
      </el-form>
      <!--<el-col :xs="24" :sm="24" :lg="24" class="editBox">-->
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确认
        </el-button>
      </div>
      <!--</el-col>-->
      <div />
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-select v-model="temp.isDeal" placeholder="是否处理" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in isDealOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, updateSystem } from '@/api/system'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import clip from '@/utils/clipboard' // use clipboard directly
import clipboard from '@/directive/clipboard/index.js' // use clipboard by v-directive
// type : normal | noElectric | worthless | problem

const bikeTypeOptions = [
  { key: 'noElectric', display_name: '空电' },
  { key: 'all', display_name: '全部' },
  { key: 'worthless', display_name: '报废' },
  { key: 'normal', display_name: '正常' },
  { key: 'problem', display_name: '故障' },
  { key: 'checking', display_name: '审核' }

]
const bikeTypeKeyValue = bikeTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})
const isMovingOptions = [
  { key: 'isMoving', display_name: '是' },
  { key: 'notMove', display_name: '否' }

]
const needNewBatteryOptions = [
  { key: true, display_name: '是' },
  { key: false, display_name: '否' }
]
const isDealOptions = [
  { key: true, display_name: '是' },
  { key: false, display_name: '否' }
]
const isMovingKeyValue = isMovingOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})
const useTypeOptions = [
  { key: 'using', display_name: '使用中' },
  { key: 'notUse', display_name: '空闲' }
]
const messageTypeOptions = [
  { key: 'problem', display_name: '上报故障' },
  { key: 'illegalReport', display_name: '非法举报' },
  { key: 'adviceBack', display_name: '意见反馈' },
  { key: 'anormalPlay', display_name: '扣费异常' }
]

const messageTypeKeyValue = messageTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})
const isDealTypeKeyValue = isDealOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})
// arr to obj, such as { CN : "China", US : "USA" }
const useTypeKeyValue = useTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves, clipboard },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    useTypeFilter(type) {
      return useTypeKeyValue[type]
    },
    bikeTypeFilter(type) {
      return bikeTypeKeyValue[type]
    },
    moveTypeFilter(type) {
      return isMovingKeyValue[type]
    },
    messageTypeFilter(type) {
      return messageTypeKeyValue[type]
    },
    isDealTypeFilter(type) {
      return isDealTypeKeyValue[type]
    }
  },
  data() {
    return {
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        id: '',
        page: 1,
        limit: 20,
        messageType: undefined,
        isDeal: undefined,
        sort: '+id'
      },
      importanceOptions: [1, 2, 3],
      needNewBatteryOptions,
      bikeTypeOptions,
      isDealOptions,
      isMovingOptions,
      useTypeOptions,
      messageTypeOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        id: undefined,
        IMEI: undefined,
        bikeType: undefined,
        isMoving: '',
        useType: '',
        bikeName: '',
        creatTime: new Date(),
        updateTime: new Date(),
        lastUserId: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        updateTime: [{ type: 'date', required: true, message: 'updateTime is required', trigger: 'change' }],
        bikeName: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {

    changeType() {
      this.dialogFormVisible = true
    },
    handleCopy(text, event) {
      clip(text, event)
    },
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        IMEI: undefined,
        bikeType: 'normal',
        isMoving: 'notMove',
        useType: 'notUse',
        bikeName: '',
        createTime: new Date(),
        updateTime: new Date(),
        lastUserId: undefined
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {

    },
    handleUpdate(row) {
      if (row.isDeal) return
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          updateSystem(tempData).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
                break
              }
            }
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row) {
      this.$notify({
        title: '成功',
        message: '删除成功',
        type: 'success',
        duration: 2000
      })
      const index = this.list.indexOf(row)
      this.list.splice(index, 1)
    },
    handleLocation(pv) {
      this.dialogPvVisible = true
    },
    handleDownload() {
      this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['updateTime', 'title', 'type', 'importance', 'status']
          const filterVal = ['updateTime', 'title', 'type', 'importance', 'status']
          const data = this.formatJson(filterVal, this.list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: 'table-list'
          })
          this.downloadLoading = false
        })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'updateTime') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>
<style>
  .my-dialog .el-dialog{
    margin:10vw 10vw !important;
    width: 80%;
  }
</style>
