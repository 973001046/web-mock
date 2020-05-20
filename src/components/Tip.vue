<template>
  <div>
    <div class="tip">CHH - MOCK</div>
  </div>
</template>

<style scoped>
.tip {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  color: rgb(84, 92, 100);
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  font-size: 23px;
  /* letter-spacing: 40px; */
  animation: myfirst 3s;
  letter-spacing: 3px;
}
@keyframes myfirst {
  from {
    letter-spacing: 70px;
  }
  to {
    letter-spacing: 3px;
  }
}
</style>
