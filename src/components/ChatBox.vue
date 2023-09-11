<template>
  <div class="chat-box-container">
    <div class="chat-box friend">
      <div class="chat-title">
        <UserInfo>
          <div class="chat-title-action">
            <Button style="margin: 0px 0.5rem">在线</Button>
            <Button>设置</Button>
          </div>
        </UserInfo>
      </div>
      <div class="chat-main">
        <ul>
          <li
            v-for="message in props.messageList"
            :key="message.id"
            :class="message.user_id === loginUserId && 'chat-mine'"
          >
            <div class="chat-user">
              <img :src="message.avatar" :alt="message.nick_name" />
              <cite>
                <template v-if="message.user_id === loginUserId">
                  <i>{{ new Date().toLocaleString() }}</i>
                  {{ message.nick_name }}
                </template>
                <template v-else>
                  {{ message.nick_name }}
                  <i>{{ new Date().toLocaleString() }}</i>
                </template>
              </cite>
            </div>
            <div class="chat-text">
              {{ message.message }}
            </div>
          </li>
        </ul>
      </div>
      <div class="chat-footer">
        <Emoji class="chat-emoji" />
        <div class="chat-tool">
          <div class="chat-tool-left">
            <Button>表情</Button>
            <Button>查找</Button>
            <Button>上传</Button>
          </div>
          <div class="chat-tool-right">
            <Button>聊天记录</Button>
          </div>
        </div>
        <div class="chat-textarea">
          <textarea v-model="inputMessage"></textarea>
        </div>
        <div class="chat-bottom">
          <Button :disabled="disabledSendButton" @click="handleSendMessage">发送</Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import UserInfo from './UserInfoBak.vue';
import Emoji from './EmojiList.vue';
import type { MessageItem } from '../common/interface';
import { Button } from 'tdesign-vue-next';

interface Props {
  messageList: MessageItem[];
}
const disabledSendButton = ref(true);
const loginUserId = 1000001;
const inputMessage = ref('');

const props = defineProps<Props>();

const emits = defineEmits(['handleSendMessage', 'handleInputMessage']);

const handleSendMessage = () => {
  emits('handleSendMessage', inputMessage);
  inputMessage.value = ''; // 清空输入框
};

watch(inputMessage, (val) => {
  if (val !== '') {
    disabledSendButton.value = false;
  } else {
    emits('handleInputMessage', inputMessage);
    disabledSendButton.value = true;
  }
});
</script>

<style lang="less">
.chat-box-container {
  width: 100%;
  height: 100%;
  .chat-box {
    width: inherit;
    height: inherit;
    display: flex;
    flex-direction: column;
    .chat-title {
      padding: 0.5rem;
      position: relative;
      border-bottom: 1px solid #e2e2e2;
      .chat-title-action {
        display: flex;
        align-items: center;
        margin-left: auto;
      }
    }

    .chat-main {
      overflow-y: auto;
      overflow-x: hidden;
      padding: 1rem 1rem 0.5rem;
      flex-grow: 1;
      ul {
        li {
          margin-bottom: 0.8rem;
          position: relative;
          min-height: 4.25rem;

          .chat-user,
          .chat-text {
            display: inline-block;
          }

          .chat-user {
            position: absolute;

            img {
              width: 3rem;
              height: 3rem;
              border-radius: 50%;
            }

            cite {
              position: absolute;
              left: 60px;
              top: -2px;
              width: 500px;
              line-height: 24px;
              font-size: 12px;
              white-space: nowrap;
              color: #999;
              text-align: left;
              font-style: normal;

              i {
                font-style: normal;
                font-size: 12px;
                margin-left: 10px;
              }
            }
          }

          .chat-text {
            position: relative;
            line-height: 22px;
            margin-top: 25px;
            padding: 8px 15px;
            background-color: #e2e2e2;
            border-radius: 3px;
            color: #333;
            word-break: break-all;
            margin-left: 4rem;

            &:after {
              content: '';
              position: absolute;
              left: -10px;
              top: 13px;
              width: 0;
              height: 0;
              border-style: solid dashed dashed;
              border-color: #e2e2e2 transparent transparent;
              overflow: hidden;
              border-width: 10px;
            }
          }
        }

        .chat-mine {
          text-align: right;
          padding-left: 0;
          padding-right: 3.75rem;

          .chat-user {
            left: auto;
            right: 0.1875rem;

            cite {
              left: auto;
              right: 60px;
              text-align: right;

              i {
                margin-left: 0;
                margin-right: 1rem;
              }
            }
          }

          .chat-text {
            margin-left: 0;
            text-align: left;
            background-color: var(--td-brand-color);

            color: #fff;

            &::after {
              left: auto;
              right: -10px;
              border-top-color: var(--td-brand-color);
            }
          }
        }
      }
    }

    .chat-footer {
      border-top: 1px solid #e2e2e2;
      position: relative;
      .chat-emoji {
        position: absolute;
        top: -8.5vh;
        left: 1vw;
        border: 1px solid;
      }
      .chat-tool {
        height: 2.5rem;
        width: 100%;
        display: flex;
        display: -webkit-flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.2rem;

        .chat-tool-left {
          display: flex;
          display: -webkit-flex;
          flex-wrap: nowrap;
          overflow: hidden;

          & > button {
            margin-right: 0.3rem;
          }
        }
      }

      .chat-textarea {
        margin-left: 0.5rem;

        textarea {
          display: block;
          width: 100%;
          padding: 0.3rem 0 0;
          height: 20vh;
          line-height: 1.5rem;
          border: none;
          overflow: auto;
          resize: none;
          background: 0 0;

          &:focus {
            outline: none;
          }
        }
      }

      .chat-bottom {
        margin: 0.4rem;
        display: flex;
        flex-direction: row-reverse;
      }
    }
  }
}
</style>
