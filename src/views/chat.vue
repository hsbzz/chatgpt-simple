<template>
  <div class="all">
    <div class="left">
      <div class="left_add" @click="addchat" onselectstart="return false">添加聊天</div>
      <div v-for="item in dataarray.singedata" :key="item.uuid">
        <chatwindow :singedata="item" :activeid="dataarray.activeuuid" @changeactiveid="changeactiveid" @deletecontent="deletecontent"></chatwindow>
      </div>
    </div>
    <div class="main">
      <chatrecord :recordData="(recordData as singedata)"></chatrecord>
    </div>

  </div>
  <div class="footer">
    <textarea type="text" class="input" rows="1" v-model="inputmsg.text" @keydown.enter="senddata"
      @input="handlechange"></textarea>
    <button class="send" @click="senddata">发送</button>
  </div>
</template>

<script setup lang="ts">
import { computed, provide, reactive, ref, watch, onMounted, inject, nextTick } from 'vue';
import chatwindow from '../components/chatwindow.vue'
import chatrecord from '@/components/chatrecord.vue';
import { getTokenAndSendMsg, failflag } from '@/hook/sendmsg'
import type { allData, singedata, chat } from '../type/index';
import { singecharshow, dealchatdata, formatCodeToMarkdown } from '@/hook/singecharshow'
import { scrollToBottom } from '@/hook/scrollmax'
const dataarray = reactive<allData>({
  activeuuid: '',
  singedata: []
})
const changeactiveid = (id: string): void => {
  dataarray.activeuuid = id
  scrollToBottom()
}
const deletecontent = (id: string): void => {
  dataarray.singedata.some((item)=>{
    if(item.uuid===id) dataarray.singedata.splice(dataarray.singedata.indexOf(item),1)
     dataarray.activeuuid = dataarray.singedata[dataarray.singedata.length - 1].uuid
     //存储数据
     localStorage.setItem("chatdata", JSON.stringify(dataarray))
     scrollToBottom()
  })
}
const inputmsg = reactive<chat>({
  datetime: '',
  isuser: true,
  text: ''
})
const getaimsg = reactive<{ msg: string, is_end: boolean, sentence_id: number }[]>([])

onMounted(() => {
  //读取数据
  if (localStorage.getItem('chatdata') != undefined || localStorage.getItem('chatdata') != null) {
    dataarray.activeuuid = JSON.parse(localStorage.getItem('chatdata') ?? '').activeuuid
    dataarray.singedata = JSON.parse(localStorage.getItem('chatdata') ?? '').singedata
  }
  else {
    addchat()
  }
})
const handlechange = (e: any): void => {
  const textarea = e.target;
  textarea.style.height = 'auto'; // 恢复默认高度
  textarea.style.height = `${textarea.scrollHeight}px`; // 设置新的高度
}
const index = reactive({ index: 0 });
let completeflag = true

//发送
const senddata = (e: any): void => {
  e.preventDefault()
  //用户的提问
  dataarray.singedata.some(item => {
    inputmsg.text = inputmsg.text.replace(/\n/, "")
    inputmsg.datetime = new Date().toString()
    if (item.uuid === dataarray.activeuuid) {
      item.chatdata.push(JSON.parse(JSON.stringify(inputmsg)))
      item.chatdata.push({
        datetime: new Date().toString(),
        isuser: false,
        text: "",
      });
      //滚条
      const maincontent = window.document.querySelector(".recordcontent")
      if (maincontent && maincontent.scrollHeight !== undefined) {
        maincontent.scrollTop = maincontent.scrollHeight;
      }
      return true
    }
  })
  //提供数据
  getTokenAndSendMsg(inputmsg.text, getaimsg)

  inputmsg.text = ''

  //定时检测数据
  const timeId = setInterval(async (): Promise<void> => {
    if (completeflag) {
      completeflag = false
      const res = await dealchatdata(getaimsg, dataarray, index)

      const maincontent = window.document.querySelector(".recordcontent")
      if (maincontent && maincontent.scrollHeight !== undefined) {
        maincontent.scrollTop = maincontent.scrollHeight;
      }
      completeflag = res as boolean
    }
    if (index.index >= getaimsg.length && completeflag === true && getaimsg[getaimsg.length - 1]?.is_end === true || failflag.value === true) {
      failflag.value = false
      getaimsg.length = 0
      console.log("数据以蔬菜完成");
      index.index = 0
      clearInterval(timeId)
      //存储数据
      localStorage.setItem("chatdata", JSON.stringify(dataarray))
      return
    }
  }, 100);
}



const addchat = (): void => {
  const id = crypto.randomUUID()
  const newchat = reactive<singedata>({
    uuid: id,
    chatdata: []
  })
  dataarray.activeuuid = id
  dataarray.singedata.push(newchat)
  console.log("添加聊天", dataarray)
}
const recordData = computed(() => {
  return dataarray.singedata.find(item => item.uuid === dataarray.activeuuid)
})
</script>
<style scoped>
.all {
  display: flex;
  flex-direction: row;
  height: 90%;
}

.left {
  overflow: auto;
  width: 200px;
  height: 85vh;
  border: 1px solid #000;
}

.left_add {
  text-align: center;
  margin: 10px;
  border: 1px solid #000;
  margin-bottom: 20px;
}

.left_add:hover {
  cursor: pointer;
  box-shadow: 2px 2px 10px #b0b0b0;
}

.main {
  overflow: auto;
  margin-left: 10px;
  width: calc(100vw - 200px);
  height: 85vh;
  border: 1px solid #000;
}

.footer {
  display: flex;
  justify-content: right;
  margin-top: 10px;
}

.input {
  overflow: hidden;
  font-size: 16px;
  display: block;
  line-height: 2;
  margin-right: 10px;
  resize: none;
  width: calc(100vw - 450px);
  outline: none;
}

.send {
  height: 36px;
  width: 200px;
}
</style>