<template>
  <div style="margin-right:100px">
    <div>
      <el-input
        placeholder="请输入视频地址"
        v-model="url"
        class="input-with-select"
        clearable
      >
        <el-select v-model="select" slot="prepend">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="search"
        ></el-button>
      </el-input>
    </div>
    <hr />
    <iframe
      allowfullscreen
      id="player"
      :src="src"
      frameborder="0"
      width="100%"
      height="500px"
      class="player"
    >
    </iframe>
  </div>
</template>

<script>
export default {
  data() {
    return {
      url: "",
      select: "https://jx.idc126.net/jx/?url=",
      options: [
        {
          label: "VIP超清视频解析",
          value: "https://jx.idc126.net/jx/?url=",
        },
        {
          label: "①号通用vip引擎系统【稳定通用】",
          value: "http://jx.598110.com/?url=",
        },
        {
          label: "②号通用vip引擎系统【稳定通用】",
          value: "http://vip.jlsprh.com/?url=",
        },
        {
          label: "③号通用vip引擎系统【稳定通用】",
          value: "http://jx.618ge.com/?url=",
        },
        {
          label: "④号通用vip引擎系统【超级稳定通用】",
          value: "http://jx.drgxj.com/?url=",
        },
        {
          label: "⑤号通用vip引擎系统【全网解析】",
          value: "http://jx.du2.cc/?url=",
        },
        {
          label: "万能接口",
          value: "https://api.sigujx.com/?url=",
        },
        {
          label: "万能接口1",
          value: "https://jx.618g.com/?url=",
        },
        {
          label: "万能接口2",
          value: "https://vip.qi71.cn/?url=",
        },
        {
          label: "万能接口3",
          value: "https://vip.jaoyun.com/index.php?url=",
        },
        {
          label: "万能接口4",
          value: "https://jqaaa.com/jq3/?url=&amp;url=",
        },
        {
          label: "万能接口5",
          value: "https://vip.bljiex.com/?v=",
        },
        {
          label: "万能接口6",
          value: "https://jiexi.071811.cc/jx2.php?url=",
        },
        {
          label: "万能接口7",
          value: "https://okjx.cc/?url=",
        },
      ],
      src: "",
      //   src: "http://106.53.58.75/cs/ff.html",
    };
  },
  methods: {
    search() {
      if (this.url.indexOf("v_19rwv8gaio") != -1 || this.url == "") {
        this.$message("视频地址无效");
      } else {
        this.src = this.select + this.url;
      }
    },
  },
};
</script>
<style scoped>
.el-select {
  width: 180px;
}
.input-with-select {
  background-color: #fff;
}
.player {
  background-image: url("../../assets/player-logo.gif");
  background-repeat: no-repeat;
  background-position: 50% 50%;
  background-color: #66ceff;
}
</style>
