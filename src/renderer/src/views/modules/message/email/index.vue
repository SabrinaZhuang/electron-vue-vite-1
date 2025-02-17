<!--
 * @Description:
 * @Author: gumingchen
 * @Email: 1240235512@qq.com
 * @Date: 2021-04-21 22:52:19
 * @LastEditors: gumingchen
 * @LastEditTime: 2021-05-28 22:18:35
-->
<template>
  <div class="g-container">
    <el-form ref="refForm" :inline="true" @keyup.enter="reacquireHandle()">
      <el-form-item>
        <el-input v-model="form.from_email" placeholder="发送邮箱" clearable />
      </el-form-item>
      <el-form-item>
        <el-input v-model="form.to_email" placeholder="收件邮箱" clearable />
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="form.date"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          clearable />
      </el-form-item>
      <el-form-item>
        <el-button v-repeat @click="reacquireHandle()">查询</el-button>
        <el-button v-repeat @click="clearJson(form), reacquireHandle()">重置</el-button>
        <el-button v-permission="'backstage:email:create'" type="primary" @click="sendHandle()">发送邮件</el-button>
        <el-button
          v-permission="'backstage:email:delete'"
          type="danger"
          @click="delHandle()"
          :disabled="selection.length <= 0">批量删除</el-button>
      </el-form-item>
    </el-form>
    <el-table
      border
      class="g-table"
      element-loading-spinner="el-icon-loading"
      v-loading="loading"
      :data="list"
      @selection-change="selectionHandle">
      <el-table-column align="center" type="selection" width="50" />
      <el-table-column
        align="center"
        label="ID"
        prop="id"
        width="80" />
      <el-table-column
        align="center"
        label="发送邮箱"
        prop="from_email"
        min-width="150"
        :show-overflow-tooltip="true" />
      <el-table-column
        align="center"
        label="收件邮箱"
        prop="to_email"
        min-width="150"
        :show-overflow-tooltip="true" />
      <el-table-column
        align="center"
        label="标题"
        prop="subject"
        min-width="150"
        :show-overflow-tooltip="true" />
      <el-table-column
        align="center"
        label="内容"
        prop="content"
        min-width="150"
        :show-overflow-tooltip="true" />
      <el-table-column
        align="center"
        label="附件"
        prop="enclosure"
        min-width="150"
        :show-overflow-tooltip="true" />
      <el-table-column
        align="center"
        label="状态"
        prop="status"
        width="80px">
        <template v-slot="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'info'">
            {{ dictionaryMap[row.status] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="创建时间"
        prop="created_at"
        width="160" />
      <el-table-column
        align="center"
        label="操作"
        width="80"
        fixed="right">
        <template v-slot="{ row }">
          <el-button
            v-permission="'backstage:email:delete'"
            type="text"
            @click="delHandle(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <g-page :page="page" @change="pageChangeHandle" />
    <send ref="refSend" v-if="visible" @refresh="getList" />
  </div>
</template>

<script>
import { defineComponent, nextTick, onBeforeMount, reactive, ref, toRefs } from 'vue'

import { ElMessage, ElMessageBox } from 'element-plus'
import Send from './components/send.vue'

import usePage from '@/mixins/page'
import useDictionary from '@/mixins/dictionary'
import { clearJson, parseDate2Str } from '@/utils'

import { delApi, pageApi } from '@/api/message/email'

export default defineComponent({
  components: { Send },
  setup() {
    const refForm = ref()
    const refSend = ref()

    const { page } = usePage()
    const { dictionaryMap, getDictionaryMap } = useDictionary()
    const data = reactive({
      loading: false,
      visible: false,
      form: {
        from_email: '',
        to_email: '',
        date: [],
        status
      },
      list: [],
      selection: []
    })

    const getList = () => {
      data.loading = true
      const params = {
        from_email: data.form.from_email,
        to_email: data.form.to_email,
        start: data.form.date && data.form.date.length ? parseDate2Str(data.form.date[0]) : '',
        end: data.form.date && data.form.date.length ? parseDate2Str(data.form.date[1]) : '',
        current: page.current,
        size: page.size
      }
      pageApi(params).then(r => {
        if (r) {
          data.list = r.data.list
          page.total = r.data.total
        }
        nextTick(() => {
          data.loading = false
        })
      })
    }

    /**
     * @description: 重新获取、重置 数据
     * @param {*}
     * @return {*}
     * @author: gumingchen
     */
    const reacquireHandle = () => {
      page.current = 1
      getList()
    }

    /**
     * @description: 新增/编辑弹窗
     * @param {*}
     * @return {*}
     * @author: gumingchen
     */
    const sendHandle = id => {
      data.visible = true
      nextTick(() => {
        refSend.value.init(id)
      })
    }

    /**
     * @description: 删除
     * @param {number} id
     * @return {*}
     * @author: gumingchen
     */
    const delHandle = id => {
      let params
      if (id) {
        params = [id]
      } else {
        params = data.selection.map(item => item.id)
      }
      ElMessageBox.confirm(`确定对[id=${ params.join(',') }]进行[${ id ? '删除' : '批量删除' }]操作?`, '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delApi(params).then(r => {
          if (r) {
            ElMessage({
              message: '操作成功!',
              type: 'success'
            })
            getList()
          }
        })
      }).catch(() => {
        // to do something on canceled
      })
    }

    /**
     * @description: table多选事件
     * @param {*} val
     * @return {*}
     * @author: gumingchen
     */
    const selectionHandle = val => {
      data.selection = val
    }

    /**
     * @description: 分页变化事件
     * @param {*}
     * @return {*}
     * @author: gumingchen
     */
    const pageChangeHandle = argPage => {
      page.current = argPage.current
      page.size = argPage.size
      getList()
    }

    onBeforeMount(() => {
      getList()
      getDictionaryMap('operation')
    })

    return {
      refForm,
      refSend,
      page,
      dictionaryMap,
      ...toRefs(data),
      getList,
      reacquireHandle,
      sendHandle,
      delHandle,
      selectionHandle,
      pageChangeHandle,
      clearJson
    }
  }
})
</script>

<style lang="scss" scoped>
</style>
