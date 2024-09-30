<template>
    <header class="top-0 left-0 bg-white z-50">
        <div class="container mx-auto px-4 py-4 sm:px-4 sm:py-4 md:px-8 md:py-8">
            <img src="/images/logo.png" alt="Logo" @click="goHome" class="w-[30%]" />
        </div>
    </header>
</template>

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();

const goHome = () => {
    router.push({ name: 'main' })
}

</script>

<style scoped> </style>