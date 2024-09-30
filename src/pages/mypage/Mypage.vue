<template>
  <div class="mypage-container">
    <!-- 상단 헤더 -->
    <header class="header">
      <button
        class="settings-button"
        @click="goSettings"
      >
        <i class="fa-solid fa-gear"></i>
      </button>
    </header>

 <!-- 프로필 영역 -->
 <div class="profile-section">
      <div class="profile-info">
        <img class="profile-image" :src="user.profileImage || 'default-profile.png'" alt="프로필 이미지" />
        <div class="profile-details">
          <h3 class="nickname">{{ user.nickname }} 님 🎖️</h3>
          <p class="achievement">{{ user.achievementText }}</p>
        </div>
      </div>
      <p class="bio">{{ user.bio }}</p>
 </div>

    <!-- 미션 진행상황 -->
    <div class="mission-progress">
      <p>현재 미션을 {{ user.missionProgress }}%만큼 달성했어요</p>
      <div class="progress-bar">
        <div class="progress" :style="{ width: user.missionProgress + '%' }"></div>
      </div>
      <p class="days-left">D-{{ user.daysLeft }}</p>
    </div>
    
    
  </div>
</template>

<script setup></script>
