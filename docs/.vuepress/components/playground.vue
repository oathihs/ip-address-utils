<template>
  <div class="ctn">
    <section>
      <div>
        <strong>IP Address and Netmask:</strong>
        <input v-model="subnet" placeholder="e.g. 192.168.0.1/24" class="input" />
        <button class="calculate-btn" @click="calculate()">Caculate</button>
        <button class="reset-btn" @click="reset()">Reset</button>
      </div>
    </section>

    <section v-if="hasResult" class="result">
      <p v-for=" row in resultRows" :key="row.dataIndex">
        <strong>{{row.label}}:</strong>
        {{row.render ? row.render(result[row.dataIndex]) : result[row.dataIndex]}}
      </p>
    </section>

    <section v-if="error" class="result error-msg">
      <p>{{error}}</p>
    </section>
  </div>
</template>

<script>
import '@dist/ip-address-utils.umd.min.js';

export default {
  data: function() {
    return {
      subnet: '',
      error: '',
      result: {},
      resultRows: [
        {
          label: 'Network Address',
          dataIndex: 'networkAddress'
        },
        {
          label: 'Broadcast Address',
          dataIndex: 'broadcastAddress'
        },
        {
          label: 'Netmask',
          dataIndex: 'netmask'
        },
        {
          label: 'CIDR',
          dataIndex: 'bitmask',
          render: text => text && `/${text}`
        },

        {
          label: 'Number of usable hosts',
          dataIndex: 'hostCount'
        },
        {
          label: 'First usable Host',
          dataIndex: 'firstHost'
        },
        {
          label: 'Last usable Host',
          dataIndex: 'lastHost'
        }
      ]
    };
  },
  computed: {
    hasResult: function() {
      return !!this.result && Object.keys(this.result).length;
    }
  },
  methods: {
    calculate() {
      const { ipv4 } = window.ipAddressUtils;
      const subnetStr = this.subnet;
      try {
        const result = ipv4.subnet(subnetStr);
        this.result = result;
        this.error = null;
      } catch (err) {
        this.result = {};
        this.error = 'Invalid IP address and netmask.';
      }
    },

    reset() {
      this.subnet = null;
      this.result = {};
      this.error = '';
    }
  }
};
</script>

<style lang="stylus" scoped>
primary-color = #3eaf7c;
primary-color-highlight = #4abf8a;
border-radius = 4px;

.ctn {
  background-color: #f3f6f8;
  border-radius: border-radius;
  min-height: 400px;
  width: calc(100% -60px);
  margin: 50px 0;
  padding: 30px;

  .input {
    border-radius: border-radius;
    border: 1px solid #ccc;
    color: #2c3e50;
    padding: 6px;
    font-size: 0.8em;
    width: 240px;
    max-width: 100%;
    margin-top: 10px;

    &:focus {
      outline: none;
      border-color: primary-color-highlight;
    }
  }

  .result {
    margin-top: 30px;
  }

  .error-msg {
    color: #f66;
  }

  .calculate-btn {
    border: 1px solid primary-color;
    border-radius: border-radius;
    display: inline-block;
    color: primary-color;
    background-color: white;
    font-size: 0.8em;
    width: 100px;
    padding: 6px 0;
    text-align: center;
    font-weight: bold;
    margin-top: 10px;

    &:hover {
      cursor: pointer;
      border-color: primary-color-highlight;
      color: primary-color-highlight;
    }

    &:focus {
      outline: none;
    }
  }

  .reset-btn {
    border: 1px solid #ccc;
    border-radius: border-radius;
    display: inline-block;
    color: #2c3e50;
    background-color: white;
    font-size: 0.8em;
    width: 100px;
    padding: 6px 0;
    text-align: center;
    margin-top: 10px;

    &:hover {
      cursor: pointer;
      border-color: #bbb;
    }

    &:focus {
      outline: none;
    }
  }
}
</style>