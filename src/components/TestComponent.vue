<template>
  <div class="home">
    <Section1 />
    <Section2 />
    <Section3 />
    <Section4 />
  </div>
</template>
  
  
<script>
import Section1 from '../components/Section1';
import Section2 from '../components/Section2';
import Section3 from '../components/Section3';
import Section4 from '../components/Section4';

export default {
  components: {
    Section1,
    Section2,
    Section3,
    Section4
  },
  data() {
    return {
      sectionY: [],
      pos: 0,
      flag: true,
    }
  },
  mounted() {
    this.resizeHandler();
    window.addEventListener('resize', this.resizeHandler);
    window.addEventListener('wheel', this.wheelHandler, { passive: false });
  },
  destroyed() {
    window.removeEventListener('resize', this.resizeHandler);
    window.removeEventListener('wheel', this.wheelHandler);
  },
  methods: {
    resizeHandler() {
      for (let i = 0; i < 4; i++) {
        this.$set(this.sectionY, i, i * window.innerHeight);
      }


      window.scrollTo({ top: this.sectionY[this.pos], behavior: 'smooth'});
    },
    wheelHandler(e) {
     
      e.preventDefault();


      if (this.flag && e.deltaY > 0) {
        this.flag = false;
        this.pageDown();
      }


      if (this.flag && e.deltaY < 0) {
        this.flag = false;
        this.pageUp();
      }


    },
    pageDown() {
      this.pos = (this.pos > 2) ? 3 : this.pos + 1;
      window.scrollTo({ top: this.sectionY[this.pos], behavior: 'smooth' });
      setTimeout(() => {
        this.flag = true;
      }, 500)
    },
    pageUp() {
      this.pos = (this.pos < 1) ? 0 : this.pos - 1;
      window.scrollTo({ top: this.sectionY[this.pos], behavior: 'smooth' });
      setTimeout(() => {
        this.flag = true;
      }, 500)
    }
  }
}
</script>