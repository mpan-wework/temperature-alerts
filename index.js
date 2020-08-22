const App = {
  name: 'TemperatureAlert',
  template: `
<div>
  <div class="inputs">
    <div>
      <input type="number" v-model="freezingThreshold" @change="resetAll" />
      <span>Freezing</span>
    </div>
    <div>
      <input type="number" v-model="boilingThreshold" @change="resetAll" />
      <span>Boiling</span>
    </div>
    <div>
      <input type="number" v-model="fluctuation" @change="resetAll" />
      <span>Fluctuation</span>
    </div>
  </div>
  <br />
  <div v-if="error">{{ error }}</div>
  <br />
  <div>
    <div>
      <input type="number" v-model="temperature" />
      <button @click="add">Add</button>
    </div>
    <ul>
      <li v-for="t of temperatures">{{ t }}</li>
    </ul>
  </div>
</div>
  `,
  data() {
    return {
      freezingThreshold: 0,
      boilingThreshold: 100,
      fluctuation: 0.5,
      temperature: 0,
      temperatures: [],
      status: null,
      error: '',
    };
  },
  methods: {
    resetAll() {
      this.temperatures = [];
      this.status = null;
      if (!Number(this.freezingThreshold) || !Number(this.boilingThreshold) || !Number(this.fluctuation)) {
        this.error = 'Boiling and freezing threshold and fluctuation must be numbers';
      } else if (this.boilingThreshold <= this.freezingThreshold) {
        this.error = 'Boiling threshold must be greater than freezing threshold';
      } else if (this.fluctuation >= this.boilingThreshold - this.freezingThreshold) {
        this.error = 'Fluctuation must be smaller than the difference of boiling and freezing threshold';
      } else {
        this.error = '';
      }
    },
    alertFor(msg) {
      this.temperatures.push(msg);
    },
    add() {
      if (this.error) {
        return;
      }

      const current = this.temperature;
      this.temperatures.push(current);

      if (this.status === null) {
        if (current >= this.boilingThreshold) {
          this.status = 'boiling';
          this.alertFor(this.status);
        } else if (current <= this.freezingThreshold) {
          this.status = 'freezing';
          this.alertFor(this.status);
        } else {
          this.status = 'normal';
        }
        return;
      }

      let status = this.status;
      if (status === 'boiling') {
        if (current < this.boilingThreshold - this.fluctuation) {
          status = 'normal';
          this.alertFor('unboiling');
        }
        if (current <= this.freezingThreshold) {
          status = 'freezing';
          this.alertFor(status);
        }
      } else if (status === 'freezing') {
        if (current > this.freezingThreshold + this.fluctuation) {
          status = 'normal';
          this.alertFor('unfreezing');
        }
        if (current >= this.boilingThreshold) {
          status = 'boiling';
          this.alertFor(status);
        }
      } else {
        if (current >= this.boilingThreshold) {
          status = 'boiling';
          this.alertFor(status);
        }
        if (current <= this.freezingThreshold) {
          status = 'freezing';
          this.alertFor(status);
        }
      }

      this.status = status;
    }
  }
};

const { Vue } = window;
new Vue({ render: (h) => h(App) }).$mount('#root');
