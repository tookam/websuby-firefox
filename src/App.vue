<template>
  <div class="max-w-md mx-auto mt-4 p-5 bg-white rounded-md shadow-md">
    <div>
      <div class="mb-4">
        <label class="block text-gray-700">Select Language</label>
        <select v-model="language" @change="saveLanguage" class="w-full mt-2 p-2 border rounded-md">
          <option v-for="lang in languages" :key="lang.value" :value="lang.value">{{ lang.label }}</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script>
import { LANGUAGES } from './constants';

export default {
  data() {
    return {
      language: 'en',
      languages: LANGUAGES,
    };
  },
  async created() {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      this.language = savedLanguage;
    }
  },
  methods: {
    saveLanguage() {
      localStorage.setItem('language', this.language);
    },
  },
};
</script>

<style>
@import './assets/tailwind.css';
</style>