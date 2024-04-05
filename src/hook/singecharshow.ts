import { nextTick, ref, reactive } from "vue";
import type { allData, singedata, chat } from "../type/index";
import TurnDownService from "turndown";
async function singecharshow(
  originstr: string,
  goalstr: any
): Promise<boolean> {
  return new Promise(async (resolve, reject) => {
    try {
      if (originstr === "") resolve(true);
      let index = 0;
      async function hook() {
        if (index < originstr.length) {
          goalstr.text += originstr[index];
          index++;
          await nextTick();
          await new Promise((resolve) => setTimeout(resolve, 10));
          await hook();
        } else {
          // goalstr.text = formatCodeToMarkdown(goalstr.text)
          resolve(true);
        }
      }
      await hook();
    } catch (error) {
      reject(error);
    }
  });
}

async function dealchatdata(
  getaimsg: Array<{ msg: string; is_end: boolean; sentence_id: number }>,
  dataarray: allData,
  index: any
): Promise<Boolean> {
  try{
    let msg = "";
    for (let key = 0; key < getaimsg.length; key++) {
      if (key >= index.index) {
        msg += getaimsg[key].msg;
        index.index++;
      }
    }
    if (msg === "") return Promise.resolve(true);
    const singedata : singedata = dataarray.singedata.find(
      (item) => item.uuid === dataarray.activeuuid
    )??{uuid:'',chatdata:[]};
    if (!singedata) Promise.resolve(false);
      const res = await singecharshow(
        msg,
        singedata.chatdata[singedata.chatdata.length - 1]
      );
      return Promise.resolve(res);
  }catch(error){
return Promise.reject(true);
  }
  
}

//markdown
function formatCodeToMarkdown(text:string){
 const turnDownService = new TurnDownService()

  // 使用 replace 方法将匹配到的代码块替换为 Markdown 代码块格式
  const markdownText = turnDownService.turndown(text)

  return markdownText;
}


export { singecharshow, dealchatdata,formatCodeToMarkdown };
