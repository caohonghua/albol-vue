<template>
  <el-container>
    <el-aside :width="aside.width">
      <Aside />
    </el-aside>
    <el-main>
      <router-view />
    </el-main>
  </el-container>
</template>
<script>
import Aside from "./Aside.vue";
export default {
  components: {
    Aside
  },
  data() {
    return {
      aside: {
        width: "200px"
      }
    };
  }
};
</script>
<style scoped>
.el-container {
  padding: 20px;
  height: 100vh;
}
</style>
