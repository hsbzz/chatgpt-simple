import { nextTick } from "vue";

async function scrollToBottom() {
    await nextTick()
    const maincontent = window.document.querySelector(".recordcontent")
    if (maincontent && maincontent.scrollHeight !== undefined) {
        maincontent.scrollTop = maincontent.scrollHeight;
    }
}
export {scrollToBottom}