<template>
    <div class="recordcontent" :style="imgbacc">
        <div :class="{ record: true, user: item.isuser }" v-for="(item, index) in props.recordData?.chatdata" :key="index">
            <div v-if="item.isuser"> <img class="svgclass" :src="user" /></div>
            <div v-else><img class="svgclass" :src="ai" /></div>
            <div :class="{ inner: true, inneruser: item.isuser }">
                <div v-if="item.text!=''" v-html="mdi.render(item.text)"></div>
                <img v-else class="loadingclass" :src="loading"/>
            </div>
        </div>
        <div v-if="recordData?.chatdata.length!=0" class="footer"><el-button type="primary" @click="stopGc">停止生成</el-button></div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, nextTick } from 'vue'
import type { allData, singedata, chat } from '../type/index';
import MarkdownIt from 'markdown-it';
import mdKatex from '@traptitech/markdown-it-katex'
import hljs from 'highlight.js';
import 'highlight.js/styles/a11y-dark.css';
import ai from '@/assets/log.svg';
import user from '@/assets/user.svg';
import loading from '@/assets/loading.svg';
import { img } from '@/hook/getimg'
import { scrollToBottom } from '@/hook/scrollmax'
import { readerFlag, failflag } from '@/hook/sendmsg'
const props = defineProps<{
    recordData?: singedata
}>()
onMounted(() => { scrollToBottom() })
const mdi: any = new MarkdownIt({
    highlight: function (code, lang) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return '<pre class="hljs"><code>' +
                    hljs.highlight(code, { language: lang }).value +
                    '</code></pre>';
            } catch (__) { }
        }

        return '<pre class="hljs"><code>' + mdi.utils.escapeHtml(code) + '</code></pre>';
    }
})
mdi.use(mdKatex)
const imgbacc = computed(() => {
    return {
        'background-image': `url(${img.value})`
    }

})
const stopGc = () => {
    readerFlag.value = 10001
    failflag.value = true
}

</script>
<style scoped>
.recordcontent {
    overflow-y: scroll;
    height: 100%;
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
    /* background-image:url('https://api.dujin.org/pic/yuanshen/'); */
}

.record {
    display: flex;
    flex-direction: row;
    margin: 10px;
    align-items: baseline;
}

.inner {
    height: fit-content;
    padding: 10px;
    max-width: 80%;
    display: flex;
    text-align: left;
    background-color: rgb(222 222 222);
}

.user {
    flex-direction: row-reverse;
}

.inneruser {
    height: fit-content;
    flex-direction: row-reverse;
    text-align: right;
    background-color: rgb(255, 255, 207);
}

.svgclass {
    width: 50px;
    margin: 10px;
    /* background-color:none; */
}
.loadingclass{
    width: 20px;
    margin: 10px;
    animation: 1s linear 0s infinite normal loading;
}

.footer {
    margin: 10px auto;
    width: fit-content;
}

.footer:deep().el-button {
    background-color: rgb(106, 0, 152);
}
.footer:hover{
    box-shadow: 0px 0px 5px rgb(0, 0, 0);
}
@keyframes loading {
    0%{
        transform: rotate(0turn);
    }
    100%{
        transform: rotate(-1turn);
    }
}

</style>