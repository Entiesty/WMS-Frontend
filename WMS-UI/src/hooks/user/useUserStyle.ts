import {ref} from "vue";
import {InfoFilled} from "@element-plus/icons-vue";

export function useUserStyle() {
    const InfoFilledIcon = InfoFilled;
    const formLabelWidth = ref<string>('80px');

    return { InfoFilledIcon, formLabelWidth };
}
