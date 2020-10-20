interface ISchema {
  name: string;
}

function render(schema: ISchema): void {
  console.log(schema);
}

export default render;
