<template>
  <!-- 设置页面的根容器 -->
  <div class="settings-container" ref="content">
    <div class="settings_wrap">
      <el-scrollbar style="height: 100%" wrap-style="overflow-x: hidden;">
        <!-- 遍历设置类别 -->
        <div
          v-show="true"
          v-for="category in settings"
          :key="category.key"
          class="settings-category"
        >
          <!-- 类别的标题 -->
          <h2 class="category-title">{{ category.title }}</h2>
          <!-- 子项包裹 -->
          <div class="setting-item-wrap">
            <!-- 遍历类别中的每个设置项 -->
            <div
              v-for="item in category.items"
              :key="item.key"
              class="setting-item"
            >
              <!-- 设置项的标签 -->
              <div class="item-label">
                <label>{{ item.title }}</label>
              </div>
              <!-- 设置项的控件 -->
              <div class="item-control">
                <!-- 根据设置项的类型动态渲染不同的控件 -->
                <div v-if="item.type === 'select'">
                  <!-- 选择框控件 -->
                  <el-select v-model="item.value" class="select-control">
                    <el-option
                      v-for="option in item.options"
                      :key="option"
                      :label="option"
                      :value="option"
                    ></el-option>
                  </el-select>
                </div>
                <div v-else-if="item.type === 'switch'">
                  <!-- 开关控件 -->
                  <el-switch
                    v-model="item.value"
                    class="switch-control"
                  ></el-switch>
                </div>
                <div v-else-if="item.type === 'button'">
                  <!-- 开关控件 -->
                  <el-button
                    :style="buttonStyle"
                    size="small"
                    @click="handlerButton(item.key)"
                    >清除</el-button
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>
<script>
import { mapActions } from "vuex";

export default {
  name: "Settings",
  data() {
    return {
      settings: [
        {
          title: "播放设置",
          key: "playSettings",
          items: [
            {
              title: "榜单忽略试听歌曲",
              key: "ignorePreviewTracks",
              type: "switch",
              value: false,
            },
          ],
        },
        {
          title: "外观设置",
          key: "appearanceSettings",
          items: [
            {
              title: "主题颜色",
              key: "themeColor",
              type: "select",
              options: ["蓝色", "绿色", "红色", "紫色"],
              value: "蓝色",
            },
          ],
        },
        {
          title: "高级设置",
          key: "advancedSettings",
          items: [
            {
              title: "清除缓存",
              key: "clearCache",
              type: "button",
            },
          ],
        },
      ],
      buttonStyle: {
        background: "var(--parmary-bg-color)",
        color: "var(--secondary-text-color)",
      },
    };
  },
  watch: {
    settings: {
      handler(val) {
        this.changeSettings(val);
      },
      deep: true,
    },
  },
  created() {
    // 读取本地缓存同步设置
    const localSettings = JSON.parse(localStorage.getItem("settings") || "{}");
    this.updateSettingsArray(this.settings, localSettings);
  },
  methods: {
    ...mapActions(["setSettings"]),
    // 更改设置项
    updateSettingsArray(arr, settingsObj) {
      arr.forEach((element) => {
        const elementSettings = settingsObj[element.key] || {};
        element.items.forEach((item) => {
          if (elementSettings[item.key] !== undefined) {
            item.value = elementSettings[item.key];
          }
        });
      });
    },
    // 更改设置 提交vuex
    changeSettings(arr) {
      const settings = {};
      for (const element of arr) {
        settings[element.key] = {};
        for (const item of element.items) {
          if (item.type !== "button") {
            settings[element.key][item.key] = item.value;
          }
        }
      }
      // 提交负荷
      this.setSettings(settings);
    },
    // 按钮事件
    handlerButton(key) {
      switch (key) {
        case "clearCache":
          this.$confirm("确定清空缓存吗？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
            customClass: "messageBox",
          })
            .then(() => {
              console.log("清除缓存");
              localStorage.clear();
            })
            .catch(() => {});
          break;
      }
    },
  },
};
</script>

<style lang="less" >
.settings_main {
  height: 100%;
  width: 100%;
}
// 定义一些基础变量
@text-color: var(--primary-text-color);
@label-text-color: var(--secondary-text-color);
@border-radius: 10px;
.settings-container {
  height: 100%;
  width: 100%;
  position: relative;
  .settings_wrap {
    width: 100%;
    height: 100%;
    position: absolute;
  }
  .settings-category {
    margin-bottom: 20px;

    .category-title {
      font-size: 26px;
      margin-bottom: 10px;
      color: @text-color;
      padding-left: 10px;
    }

    .setting-item-wrap {
      background-color: var(--secondary-bg-color);
      padding: 14px 20px;
      border-radius: @border-radius;

      .setting-item {
        height: 52px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 14px;

        .item-label {
          flex: 1;
          margin-right: 10px;
          color: @label-text-color;
        }

        .item-control {
          .input-control,
          .select-control,
          .switch-control {
            width: 100%;
          }
        }
      }
    }
  }
}
</style>