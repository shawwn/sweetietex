// @flow

export default function classie(classArray, toggleClasses) {
  const classes = [];

  if (classArray && Array.isArray(classArray)) {
    classArray.forEach((c) => {
      if (c && c.length) classes.push(c);
    });
  }

  if (toggleClasses && typeof toggleClasses === 'object' && Object.keys(toggleClasses).length) {
    const keys = Object.keys(toggleClasses);
    for (let i = 0; i < keys.length; i += 1) {
      if (toggleClasses[keys[i]]) {
        classes.push(keys[i]);
      }
    }
  }

  return classes.join(' ');
}
