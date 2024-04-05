<template>
    <div class="content" :style="{ border: borderColor.border }" @click="changestatus">{{
        props.singedata.chatdata[0]?.text.substring(0, 7) ?? '新聊天' }}<img class="svgclass" :src="deleteflag"
            @click="dialogVisible = true" /></div>
    <div class="dialog"> <el-dialog v-model="dialogVisible" title="删除" width="500">
            <span style="text-align: center;">确定删除吗</span>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="deleteComfirm">
                        确定
                    </el-button>
                </div>
            </template>
        </el-dialog></div>
</template>
<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import type { allData, singedata, chat } from '../type/index';
import deleteflag from '@/assets/delete.svg';
const props = defineProps<{
    singedata: singedata,
    activeid: string,
}>()
const dialogVisible = ref(false)
const emit = defineEmits(['changeactiveid', 'deletecontent'])
const borderColor = reactive({ border: '1px solid #000' })
const changestatus = () => {
    emit('changeactiveid', props.singedata.uuid)
    borderColor.border = '2px solid #ff0000'
}
watch(() => props.activeid, (newval) => {
    if (newval === props.singedata.uuid)
        borderColor.border = '2px solid #ff0000'
    else
        borderColor.border = '1px solid #000'

}, { immediate: true })
const deleteComfirm = () => {
    emit('deletecontent', props.singedata.uuid)
}
</script>
<style scoped>
.content {
    white-space: nowrap;
    /* 强制文本不换行 */
    text-overflow: ellipsis;
    /* 当文本超出时显示省略号 */
    margin: 10px;
    text-align: center;
    overflow: hidden;
    border: 1px solid #000;
    line-height: 1.5;
    position: relative;
}

.content:hover {
    cursor: pointer;
    background-color: #c3c3c3;
}

.svgclass {
    position: absolute;
    right: 5px;
    height: 15px;
    top: 5px;
    /* background-color:none; */
}

.svgclass:hover {
    background-color: rgb(138, 138, 138);
}
.dialog:deep().el-dialog{
    width:300px;
    text-align: center;
}
.dialog:deep().dialog-footer{
    text-align: center;
}
.dialog:deep().el-dialog__header{
    margin-left:20px;
}

</style>