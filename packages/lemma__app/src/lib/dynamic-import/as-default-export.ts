export default function asDefaultExport<Name extends string>(name: Name) {
  return <Module extends { [key in Name]: any }>(module: Module) => ({ default: module[name] } as { default: any });
}
