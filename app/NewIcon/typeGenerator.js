const {icons} = await import('./selection.json')
console.log(
  `export type NewIconNames = "${icons.map(icon => icon.properties.name).join('" | "')}"`
)