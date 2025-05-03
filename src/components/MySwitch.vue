<template>
  <div class="switch_main" @click="toggle" :class="isOn ? 'on' : 'off'">
    <div class="switch_warrp">
      <div
        class="switch_slider"
        :style="{
          left: isOn ? '50%' : '0',
        }"
      >
        <i
          class="iconfont"
          :class="isOn ? 'icon-moonyueliang' : 'icon-taiyangtianqi'"
        ></i>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MySwitch",
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isOn: this.value,
    };
  },
  watch: {
    value(newVal) {
      this.isOn = newVal;
    },
  },
  methods: {
    toggle() {
      this.isOn = !this.isOn;
      this.$emit("input", this.isOn);
      this.$emit("change", this.isOn);
    },
  },
};
</script>

<style lang="less" scoped>
.switch_main {
  transition: border var(--transition-duration);
  cursor: pointer;
  width: 42px;
  height: 22px;
  background-color: #d2d2d2;
  border-radius: 4px;
  border: 2px solid #d4dfd9;
  &.on {
    border-color: #41e396;
    background: linear-gradient(to top left, #38aaac, #41e396);
  }
  .switch_warrp {
    position: relative;
    width: 40px;
    height: 20px;
    border: 1px solid transparent;
    border-radius: inherit;
    .switch_slider {
      transition: left var(--transition-duration);
      position: absolute;
      top: 0;
      left: 0;
      border-radius: inherit;
      width: 20px;
      height: 20px;
      box-sizing: border-box;
      border: 1px solid #bfc4c0;
      background-color: #fff;
      box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      color: #808080;
      .icon-taiyangtianqi {
        font-weight: 600;
      }
    }
  }
}
</style>