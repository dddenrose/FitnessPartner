declare module "*.wav" {
  const src: string;
  export default src;
}

declare module "*.css" {
  const content: any;
  export default content;
}

declare module "*.module.css" {
  const classes: { [key: string]: string };
  export default classes;
}
