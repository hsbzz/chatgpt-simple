import { provide, reactive,ref } from "vue";

const failflag = ref(false)
const readerFlag = ref<number>(0)
function gettoken() {
  const ak = "p3bNRvOfzessksyWfZ5pFoaS";
  const sk = "T7YUl9BrETlo83v6t6qRqOEF8cuQtDql";
  return new Promise((resolve, reject) => {
    fetch(
      `/oauth/2.0/token?client_id=${ak}&client_secret=${sk}&grant_type=client_credentials`,
      { mode: "same-origin" }
    )
      .then((res) => res.json())
      .then((data) => {
        resolve(data.access_token);
      })
      .catch((error) => {
        // 处理错误情况
        reject(error);
      });
  });
}
async function sendmsg(token: any, userMsg: any, getMsg: any):Promise<void> {    
  const response = await fetch(
    `/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/yi_34b_chat?access_token=${token}`,
    {
      body: JSON.stringify({
        messages: [
          { role: "user", content: userMsg },
          // { role: 'assistant', content: '这里可以填入助手的回复内容。' }
        ],
        stream: true,
      }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
      mode: "same-origin",
    }
  );
  const decoder = new TextDecoder("utf-8");
  const reader = response.body?.getReader();
  for (readerFlag.value=0;readerFlag.value<10000;readerFlag.value++) {
    const result = await reader?.read();
    if (!result) break;

    const { done, value } = result;
    if (done) {
      break;
    }

    try{
      let jsonString = decoder.decode(value);
      jsonString = jsonString.replace(/data/, '"data"');
      jsonString = "{" + jsonString + "}";
      let finaldata = JSON.parse(jsonString);
      console.log("数据",finaldata);
       if(finaldata===null||finaldata===undefined||Object.keys(finaldata).length === 0) continue;
      getMsg.push({
        msg:finaldata.data.result,
        is_end:finaldata.data.is_end,
        sentence_id:finaldata.data.sentence_id
      })
    }catch(error){
      failflag.value=true
      console.log(error);
    }
    
  }
}

async function getTokenAndSendMsg(userMsg: any, getMsg: any):Promise<void> {
  try {
    const tokenData = await gettoken();
    sendmsg(tokenData, userMsg, getMsg);
  } catch (error) {
    console.error("获取数据失败",error);
  }
}

export { getTokenAndSendMsg,failflag,readerFlag };
