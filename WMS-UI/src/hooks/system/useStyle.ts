import {ref} from "vue";
import {InfoFilled} from "@element-plus/icons-vue";

export function useStyle() {
    const InfoFilledIcon = InfoFilled;
    const formLabelWidth = ref<string>('80px');

    return { InfoFilledIcon, formLabelWidth };
}
