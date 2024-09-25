import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useBankStore = defineStore('bank', () => {
    const selectedBank = ref(null); // 선택된 은행을 저장할 상태

    // 선택된 은행을 설정하는 함수
    const setSelectedBank = (bankName) => {
        selectedBank.value = bankName; // 선택된 은행 이름 저장
    };

    // 선택된 은행을 가져오는 함수
    const getSelectedBank = () => {
        return selectedBank.value; // 현재 선택된 은행 이름 반환
    };

    return { selectedBank, setSelectedBank, getSelectedBank };
});
