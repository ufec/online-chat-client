<template>
  <div id="app">
    <span v-for="(v, i) of bits" :key="v">
      <input
        v-model="bits[i]"
        :class="i > 0 ? (i > 11 ? 'fraction' : 'exponent') : 'sign'"
        type="number"
        min="0"
        max="1"
      />
      <input v-if="i == 11" disabled value="1" />
      <br v-if="i == 31" />
    </span>
    <br />
    <input v-model="value" style="width: 5em" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'IEEETest',
  setup() {
    return {
      bits: Array(65)
        .join('0')
        .split('')
        .map((v) => Number(v)),
      value: 125,
    };
    // const bits = ref<number[]>([]);
    // const value = ref<number>(0);

    // const updateBits = () => {
    //   const bits = [];
    //   const sign = value.value < 0 ? 1 : 0;
    //   const absValue = Math.abs(value.value);
    //   const exponent = Math.floor(Math.log2(absValue));
    //   const fraction = absValue / 2 ** exponent - 1;
    //   for (let i = 0; i < 32; i++) {
    //     if (i === 0) {
    //       bits.push(sign);
    //     } else if (i > 0 && i < 12) {
    //       bits.push((exponent >> (11 - i)) & 1);
    //     } else if (i > 11 && i < 32) {
    //       bits.push((fraction >> (31 - i)) & 1);
    //     } else {
    //       bits.push(1);
    //     }
    //   }
    //   return bits;
    // };

    // const updateValue = () => {
    //   const sign = bits.value[0];
    //   const exponent = bits.value
    //     .slice(1, 12)
    //     .reduce((acc, cur, i) => acc + cur * 2 ** (11 - i), 0);
    //   const fraction = bits.value.slice(12).reduce((acc, cur, i) => acc + cur * 2 ** (31 - i), 0);
    //   return (sign ? -1 : 1) * (1 + fraction / 2 ** 20) * 2 ** (exponent - 1023);
    // };

    // return {
    //   bits,
    //   value,
    //   updateBits,
    //   updateValue,
    // };
  },
  watch: {
    value(val) {
      const bytes = new Uint8Array(8);
      const memory = new Float64Array(bytes.buffer);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      memory[0] = val;
      for (let i = 0; i < 8; i++) {
        let byte = bytes[i];
        console.log(byte);
        for (let j = 0; j < 8; j++) {
          this.bits[(8 - i) * 8 - j - 1] = byte & 1;
          byte = byte >> 1;
        }
      }
    },
  },
});
</script>

<style>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
.container input[type='number'] {
  -moz-appearance: textfield;
}
span {
  padding: 0;
  margin: 0;
}
input {
  width: 1em;
  height: 2em;
  text-align: center;
}
.sign {
  background-color: lightblue;
}
.exponent {
  background-color: orange;
}
</style>
