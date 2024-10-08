<!-- TermsModal.vue -->
<template>
  <div class="modal-overlay" v-if="isOpen">
    <div class="modal">
      <div class="modal-content">
        <h2 class="text-lg font-bold mb-4">개인정보 제공 및 약관 동의</h2>

        <!-- 전체 동의 -->
        <div class="toggle_all mb-4">
          <label class="label flex items-center">
            <input
              type="checkbox"
              v-model="allAgree"
              @change="toggleAll"
              class="mr-2"
            />
            <span>전체 동의하기</span>
          </label>
        </div>

        <!-- 개별 약관 -->
        <div class="toggle_each">
          <div v-for="(term, index) in localTerms" :key="index" class="mb-4">
            <label class="flex items-center ml-2">
              <input type="checkbox" v-model="term.agreed" class="mr-2" />
              <span>{{ term.utilTitle }}</span>
            </label>

            <!-- 스크롤 가능한 약관 내용 -->
            <div class="terms-content">
              {{ term.utilContent }}
            </div>
          </div>
        </div>

        <div class="mt-6 flex justify-end space-x-2">
          <button @click="closeModal" class="gray-button">취소</button>
          <button @click="confirmAgreement" class="button">확인</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps(["isOpen", "terms"]);
const emit = defineEmits(["close", "confirm"]);

const allAgree = ref(false);
const localTerms = ref([]);
const allAgreed = ref(false); // 모든 약관이 동의되었는지 여부

// props로 전달된 terms 데이터를 localTerms에 복사
watch(
  () => props.terms,
  (newTerms) => {
    localTerms.value = newTerms.map((term) => ({
      ...term,
      showContent: false, // 내용 보기를 기본적으로 숨긴 상태
    }));
    localTerms.value = [...localTerms.value]; // 반응성 보장
  },
  { immediate: true }
);

// 모든 약관 동의 상태에 따른 전체 동의 상태 업데이트
watch(
  localTerms,
  (newTerms) => {
    allAgree.value = newTerms.every((term) => term.agreed);
    allAgreed.value = allAgree.value; // 모든 약관이 동의된 상태를 저장
  },
  { deep: true }
);

// 전체 동의 토글 함수
const toggleAll = () => {
  // 약관 모두 동의 상태 반영
  localTerms.value.forEach((term) => {
    term.agreed = allAgree.value;
  });
};

//모달 닫기
const closeModal = () => {
  emit("close");
};

//약관 동의 확인
const confirmAgreement = () => {
  if (!allAgreed.value) {
    alert("모든 약관에 동의해야 가입이 가능합니다.");
    return;
  }
  emit("confirm", localTerms.value);
};
</script>
