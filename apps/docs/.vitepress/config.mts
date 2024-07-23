import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'Naytive',
  description:
    'Naytive is a fast, lightweight and easy-to-use interface for writing low-level code in TypeScript.',
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: 'https://github.com/naytive/naytive' },
    ],

    sidebar: [
      {
        text: 'Introduction',
        items: [
          { text: 'Getting Started', link: '/docs/intro/' },
          { text: 'Installation', link: '/docs/intro/installation' },
          { text: 'Project Config', link: '/docs/intro/config' },
          { text: 'Naytive Comparison', link: '/docs/intro/comparison' },
          { text: 'Language Tour', link: '/docs/intro/tour' },
          { text: 'Naytive for C++ devs', link: '/docs/intro/for-cpp-devs' },
          { text: 'Naytive for TS devs', link: '/docs/intro/for-ts-devs' },
        ],
      },
      {
        text: 'Language Guide',
        items: [
          { text: 'Basics', link: '/docs/lang/basics' },
          { text: 'Imports', link: '/docs/lang/imports' },
          { text: 'Standard lib', link: '/docs/lang/std' },
          { text: 'Comments', link: '/docs/lang/comments' },
          { text: 'Control Flow', link: '/docs/lang/control-flow' },
          { text: 'Namespacing', link: '/docs/lang/namespacing' },
          { text: 'Error handling', link: '/docs/lang/error-handling' },
        ],
      },
      {
        text: 'Data Types',
        items: [
          { text: 'General Types', link: '/docs/datatypes/' },
          { text: 'Strings', link: '/docs/datatypes/strings' },
          { text: 'Numbers', link: '/docs/datatypes/numbers' },
          { text: 'Objects/Structs', link: '/docs/datatypes/objects' },
          { text: 'Mixed Types', link: '/docs/datatypes/compound-types' },
          // { text: 'Optionals', link: '/docs/datatypes/optionals' },
          { text: 'Type Casting', link: '/docs/datatypes/casting' },
          { text: 'Generics', link: '/docs/datatypes/generics' },
          { text: 'Enums', link: '/docs/datatypes/enums' },
        ],
      },
      {
        text: 'Memory Management',
        items: [
          { text: 'Naytive Memory', link: '/docs/memory/' },
          { text: 'Pointers', link: '/docs/memory/pointers' },
          // { text: 'Installation', link: '/docs/memory/installation' },
          // { text: 'Naytive for C++ devs', link: '/docs/memory/for-cpp-devs' },
          // { text: 'Naytive for TS devs', link: '/docs/memory/for-ts-devs' },
        ],
      },
      {
        text: 'OOP',
        items: [
          { text: 'OOP Basics', link: '/docs/oop/' },
          { text: 'Inheritance', link: '/docs/oop/inheritance' },
          // { text: 'Installation', link: '/docs/oop/installation' },
          // { text: 'Naytive for C++ devs', link: '/docs/oop/for-cpp-devs' },
          // { text: 'Naytive for TS devs', link: '/docs/oop/for-ts-devs' },
        ],
      },
      {
        text: 'Advanced',
        items: [
          { text: 'Async Naytive', link: '/docs/advanced/async' },
          { text: 'Curl', link: '/docs/advanced/curl' },
          // { text: 'Installation', link: '/docs/advanced/installation' },
          // { text: 'Naytive for C++ devs', link: '/docs/advanced/for-cpp-devs' },
          // { text: 'Naytive for TS devs', link: '/docs/advanced/for-ts-devs' },
        ],
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/naytive/naytive' },
    ],
  },
});
