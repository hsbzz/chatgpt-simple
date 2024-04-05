import { ref } from "vue";
import axios from "axios";
const img = ref("");
function getimg(): Promise<string> {
    return new Promise((resolve, reject) => {
      axios("/api/v2")
        .then((res) => {
          console.log("data", res.data.data[0].url);
          resolve(res.data.data[0].url);
        })
        .catch((error) => {
          // 处理错误情况
          console.log(error);
          reject("src/assets/jingliu.jpg");
        });
    });
  }
  getimg().then((data) => {
    img.value = data
  })
export { img };
