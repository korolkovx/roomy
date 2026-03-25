try {
  const babel = require('@babel/core');
  const result = babel.transformFileSync('./App.js', {
    presets: ['babel-preset-expo']
  });
  console.log("Syntax is valid!");
} catch (e) {
  console.error("Syntax Error:", e.message);
}
