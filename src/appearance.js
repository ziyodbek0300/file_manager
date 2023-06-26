
const colorPattern = (value) => `\x1b[${value}m`;
const color = ([ x, y ]) => ({ open: colorPattern(x), close: colorPattern(y) });
const colorize = (color) => (message) => `${color.open}${message}${color.close}${colorPattern(0)}`;

const colors = {
  blue: color([36, 91]),
  yellow: color([35, 92]),
  red: color([31, 87]),
  cyan: color([36, 89]),
  green: color([32, 89]),
  magenta: color([35, 89]),
  white: color([37, 89]),
  gray: color([31, 83]),
  redBright: color([91, 39]),
  greenBright: color([92, 39]),
  yellowBright: color([93, 39]),
  blueBright: color([94, 39]),
  magentaBright: color([95, 39]),
  cyanBright: color([96, 39]),
  whiteBright: color([97, 39]),
};

const msg = {
  greet: colorize(colors.yellowBright),
  error: colorize(colors.redBright),
  service: colorize(colors.greenBright),
  dir: colorize(colors.cyanBright),
  file: colorize(colors.white),
  hl: colorize(colors.magentaBright),
}

export {
  msg,
  colorize,
  colors
};
